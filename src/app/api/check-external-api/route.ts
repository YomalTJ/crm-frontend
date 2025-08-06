import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { url, method, payload, queryParams, requiresAuth, authToken, userCredentials } = body

        // Build URL with query parameters if provided
        let finalUrl = url
        if (queryParams && Object.keys(queryParams).length > 0) {
            const searchParams = new URLSearchParams()
            Object.entries(queryParams).forEach(([key, value]) => {
                searchParams.append(key, String(value))
            })
            finalUrl = `${url}?${searchParams.toString()}`
        }

        // Set up headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        // Add auth header if required
        if (requiresAuth) {
            let token = authToken

            if (!token) {
                // Try to get token from cookies first
                const cookieStore = cookies()
                const wbbAuthToken = (await cookieStore).get('wbbAuthToken')?.value
                token = wbbAuthToken
            }

            if (!token) {
                // If no token, try to login first using provided credentials
                const loginCredentials = userCredentials || {
                    username: "12345678",
                    password: "@7@7sdsss"
                }

                try {
                    const loginResponse = await fetch('https://api.wbb.gov.lk/api/samurthi/AuthSamurthi/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(loginCredentials)
                    })

                    if (!loginResponse.ok) {
                        return NextResponse.json({
                            success: false,
                            statusCode: loginResponse.status,
                            responseTime: 0,
                            error: 'Failed to authenticate',
                            data: null
                        }, { status: 401 })
                    }

                    const loginData = await loginResponse.json()
                    token = loginData?.token?.accessToken

                    if (token) {
                        // Store the new token in cookies
                        const cookieStore = await cookies()
                        cookieStore.set('wbbAuthToken', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 24 // 1 day
                        })
                    }
                } catch (loginError) {
                    return NextResponse.json({
                        success: false,
                        statusCode: null,
                        responseTime: 0,
                        error: 'Login failed: ' + (loginError instanceof Error ? loginError.message : 'Unknown error'),
                        data: null
                    }, { status: 401 })
                }
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        // Set up fetch options
        const options: RequestInit = {
            method: method,
            headers,
            signal: AbortSignal.timeout(30000) // 30 second timeout
        }

        // Add body for POST requests (only if we have payload, not query params)
        if (method === 'POST' && payload) {
            options.body = JSON.stringify(payload)
        }

        // Make the external API call using the final URL with query parameters
        const startTime = Date.now()
        let response: Response

        try {
            response = await fetch(finalUrl, options)
        } catch (fetchError) {
            if (fetchError instanceof DOMException && fetchError.name === 'TimeoutError') {
                return NextResponse.json({
                    success: false,
                    statusCode: 408,
                    responseTime: Date.now() - startTime,
                    error: 'Request timeout',
                    data: null
                }, { status: 408 })
            }
            throw fetchError
        }

        const responseTime = Date.now() - startTime

        // Handle 401 unauthorized - clear token and return error
        if (response.status === 401 && requiresAuth) {
            // Clear invalid token
            const cookieStore = await cookies()
            cookieStore.delete('wbbAuthToken')

            return NextResponse.json({
                success: false,
                statusCode: 401,
                responseTime,
                error: 'Authentication failed - token expired or invalid',
                data: null
            }, { status: 401 })
        }

        // Try to parse response
        let responseData = null
        const contentType = response.headers.get('content-type')

        try {
            if (contentType && contentType.includes('application/json')) {
                const responseText = await response.text()
                if (responseText.trim()) {
                    responseData = JSON.parse(responseText)
                }
            } else {
                responseData = await response.text()
            }
        } catch (parseError) {
            console.warn('Failed to parse response:', parseError)
            responseData = null
        }

        return NextResponse.json({
            success: response.ok,
            statusCode: response.status,
            responseTime,
            data: responseData,
            headers: Object.fromEntries(response.headers.entries())
        })

    } catch (error) {
        console.error('API proxy error:', error)

        return NextResponse.json({
            success: false,
            statusCode: null,
            responseTime: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null
        }, { status: 500 })
    }
}