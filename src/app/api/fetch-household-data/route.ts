// app/api/fetch-household-data/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Retrieves token from all possible sources
 * Priority: Cookies -> x-auth-token header -> x-session-storage-token -> x-local-storage-token
 */
async function getTokenFromAllSources(request: NextRequest): Promise<string | null> {
    // 1. Try cookies first
    try {
        const cookieStore = await cookies()
        const cookieToken = cookieStore.get('wbbAuthToken')?.value
        if (cookieToken) {
            console.log('Token from cookies')
            return cookieToken
        }
    } catch (error) {
        console.warn('Failed to read cookies:', error)
    }

    // 2. Try x-auth-token header
    const headerToken = request.headers.get('x-auth-token')
    if (headerToken) {
        console.log('Token from x-auth-token header')
        return headerToken
    }

    // 3. Try x-session-storage-token header
    const sessionToken = request.headers.get('x-session-storage-token')
    if (sessionToken) {
        console.log('Token from x-session-storage-token header')
        return sessionToken
    }

    // 4. Try x-local-storage-token header
    const localToken = request.headers.get('x-local-storage-token')
    if (localToken) {
        console.log('Token from x-local-storage-token header')
        return localToken
    }

    return null
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { gn_code, level } = body

        if (!gn_code) {
            return NextResponse.json({
                success: false,
                error: 'GN code is required'
            }, { status: 400 })
        }

        // Try to get token from all sources
        let authToken = await getTokenFromAllSources(request)

        if (!authToken) {
            // Emergency login as fallback
            try {
                const loginResponse = await fetch('https://api.wbb.gov.lk/api/samurthi/AuthSamurthi/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "12345678",
                        password: "@7@7sdsss"
                    })
                })

                if (loginResponse.ok) {
                    const loginData = await loginResponse.json()
                    authToken = loginData?.token?.accessToken

                    if (authToken) {
                        // Try to store in cookie
                        try {
                            const cookieStore = await cookies()
                            cookieStore.set('wbbAuthToken', authToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 60 * 60 * 24
                            })
                        } catch (cookieError) {
                            console.warn('Could not set cookie:', cookieError)
                        }
                    }
                }
            } catch (loginError) {
                console.error('Emergency login failed:', loginError)
            }
        }

        if (!authToken) {
            return NextResponse.json({
                success: false,
                error: 'Authentication token not found. Please login first.'
            }, { status: 401 })
        }

        // Build the API URL with query parameters
        const apiUrl = `https://api.wbb.gov.lk/api/Samurthis/GetByGn?gn_code=${encodeURIComponent(gn_code)}&level=${level}`

        // Make the API call
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(30000)
        })

        if (!response.ok) {
            if (response.status === 401) {
                // Clear invalid token from all sources
                try {
                    const cookieStore = await cookies()
                    cookieStore.delete('wbbAuthToken')
                } catch (error) {
                    console.warn('Could not delete cookie:', error)
                }

                return NextResponse.json({
                    success: false,
                    error: 'Authentication failed. Please login again.'
                }, { status: 401 })
            }

            return NextResponse.json({
                success: false,
                error: `API request failed with status ${response.status}`
            }, { status: response.status })
        }

        // Parse the response
        const data = await response.json()

        if (!Array.isArray(data)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid response format from API'
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data: data,
            count: data.length
        })

    } catch (error) {
        console.error('Error fetching household data:', error)

        if (error instanceof DOMException && error.name === 'TimeoutError') {
            return NextResponse.json({
                success: false,
                error: 'Request timeout. Please try again.'
            }, { status: 408 })
        }

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 })
    }
}