// app/api/check-external-api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Retrieves token from: Cookies -> Custom Header -> SessionStorage Header
 * Priority: Cookies (from cookies header) -> x-auth-token header -> fallback login
 */
async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
    // 1. Try to get from cookies (if available on server)
    try {
        const cookieStore = cookies()
        const cookieToken = (await cookieStore).get('wbbAuthToken')?.value
        if (cookieToken) {
            console.log('Token retrieved from cookies')
            return cookieToken
        }
    } catch (error) {
        console.warn('Failed to read cookies:', error)
    }

    // 2. Try to get from x-auth-token header (passed from client)
    const headerToken = request.headers.get('x-auth-token')
    if (headerToken) {
        console.log('Token retrieved from x-auth-token header')
        return headerToken
    }

    // 3. Try to get from x-session-storage header (passed from client)
    const sessionHeaderToken = request.headers.get('x-session-storage-token')
    if (sessionHeaderToken) {
        console.log('Token retrieved from x-session-storage-token header')
        return sessionHeaderToken
    }

    // 4. Try to get from x-local-storage header (passed from client)
    const localHeaderToken = request.headers.get('x-local-storage-token')
    if (localHeaderToken) {
        console.log('Token retrieved from x-local-storage-token header')
        return localHeaderToken
    }

    return null
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { url, method, payload, queryParams, requiresAuth, authToken, userCredentials } = body

        // Build URL with query parameters
        let finalUrl = url
        if (queryParams && Object.keys(queryParams).length > 0) {
            const searchParams = new URLSearchParams()
            Object.entries(queryParams).forEach(([key, value]) => {
                searchParams.append(key, String(value))
            })
            finalUrl = `${url}?${searchParams.toString()}`
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        // Add auth header if required
        if (requiresAuth) {
            let token = authToken

            // If no token provided, try to get from all sources
            if (!token) {
                token = await getTokenFromRequest(request)
            }

            if (!token) {
                // Last resort - try to login first using provided credentials
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
                        // Try to store token in cookies, but don't fail if it doesn't work
                        try {
                            const cookieStore = await cookies()
                            cookieStore.set('wbbAuthToken', token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 60 * 60 * 24
                            })
                        } catch (cookieError) {
                            console.warn('Could not set cookie (non-SSL environment):', cookieError)
                            // Continue with token from response
                        }
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

        const options: RequestInit = {
            method: method,
            headers,
            signal: AbortSignal.timeout(30000) // 30 second timeout
        }

        if (method === 'POST' && payload) {
            options.body = JSON.stringify(payload)
        }

        // Make the external API call
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

        // Handle 401 unauthorized
        if (response.status === 401 && requiresAuth) {
            try {
                const cookieStore = await cookies()
                cookieStore.delete('wbbAuthToken')
            } catch (error) {
                console.warn('Could not delete cookie:', error)
            }

            return NextResponse.json({
                success: false,
                statusCode: 401,
                responseTime,
                error: 'Authentication failed - token expired or invalid',
                data: null
            }, { status: 401 })
        }

        // Parse response
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