// app/api/get-auth-token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Get authentication token from WBB API
 * Attempts to retrieve from cache first, then authenticates if needed
 * Saves token to cookies for server-side use
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, password } = body

        const loginCredentials = {
            username: username || "12345678",
            password: password || "@7@7sdsss"
        }

        const cookieStore = await cookies()
        const existingToken = cookieStore.get('wbbAuthToken')?.value

        // Test if existing token is still valid
        if (existingToken) {
            try {
                const testResponse = await fetch('https://api.wbb.gov.lk/api/Samurthis/GetByGn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${existingToken}`
                    },
                    body: JSON.stringify({
                        gn_code: "test",
                        level: 1
                    })
                })

                if (testResponse.status !== 401) {
                    return NextResponse.json({
                        success: true,
                        accessToken: existingToken,
                        source: 'cache'
                    })
                }
            } catch (error) {
                console.warn('Token validation failed, getting new one:', error)
            }
        }

        // Get new token from login endpoint
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
                error: 'Login failed',
                statusCode: loginResponse.status
            }, { status: loginResponse.status })
        }

        const loginData = await loginResponse.json()
        const newToken = loginData?.token?.accessToken

        if (!newToken) {
            return NextResponse.json({
                success: false,
                error: 'No access token received from login',
                responseStructure: loginData
            }, { status: 400 })
        }

        // Attempt to set cookie - will work in production with SSL
        try {
            cookieStore.set('wbbAuthToken', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 // 1 day
            })
        } catch (cookieError) {
            console.warn('Failed to set cookie (expected in non-SSL environments):', cookieError)
            // Continue anyway - token will be passed via request body and client-side storage
        }

        // Return token for client-side storage in all storage methods
        return NextResponse.json({
            success: true,
            accessToken: newToken,
            source: 'fresh',
            expiresIn: loginData.data?.token?.expiresIn || '24h',
            refreshToken: loginData.data?.token?.refreshToken,
            storageInstruction: 'Store in localStorage, sessionStorage, and cookies'
        })

    } catch (error) {
        console.error('Auth token error:', error)

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}