import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        // Get user credentials from request body
        const body = await request.json()
        const { username, password } = body

        // Use provided credentials or fallback to default
        const loginCredentials = {
            username: username || "12345678",
            password: password || "@7@7sdsss"
        }

        // First check if we have a valid token in cookies
        const cookieStore = await cookies()
        const existingToken = cookieStore.get('wbbAuthToken')?.value

        if (existingToken) {
            // Test if the existing token is still valid by making a simple request
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

                // If we get anything other than 401, the token is likely still valid
                if (testResponse.status !== 401) {
                    return NextResponse.json({
                        success: true,
                        accessToken: existingToken,
                        source: 'cache'
                    })
                }
            } catch (error) {
                console.log('Token validation failed:', error)
            }
        }

        // If no token or token is invalid, get a new one using provided credentials
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
        console.log("loginData: ", loginData);
        
        const newToken = loginData?.token?.accessToken
        console.log("newToken: ", newToken);

        if (!newToken) {
            console.log('Login response structure:', JSON.stringify(loginData, null, 2))
            return NextResponse.json({
                success: false,
                error: 'No access token received from login',
                responseStructure: loginData
            }, { status: 400 })
        }

        // Store the new token in cookies
        cookieStore.set('wbbAuthToken', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
        })

        return NextResponse.json({
            success: true,
            accessToken: newToken,
            source: 'fresh',
            expiresIn: loginData.data?.token?.expiresIn || '24h',
            refreshToken: loginData.data?.token?.refreshToken
        })

    } catch (error) {
        console.error('Auth token error:', error)

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}