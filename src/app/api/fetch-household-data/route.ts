// app/api/fetch-household-data/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

        // Get auth token from cookies
        const cookieStore = await cookies()
        const authToken = cookieStore.get('wbbAuthToken')?.value

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
            signal: AbortSignal.timeout(30000) // 30 second timeout
        })

        if (!response.ok) {
            if (response.status === 401) {
                // Clear invalid token
                cookieStore.delete('wbbAuthToken')
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

        // Validate the response structure
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