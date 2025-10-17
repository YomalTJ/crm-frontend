import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { households, gn_code } = body

        if (!households || !Array.isArray(households) || households.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No household data provided'
            }, { status: 400 })
        }

        if (!gn_code) {
            return NextResponse.json({
                success: false,
                error: 'GN code is required'
            }, { status: 400 })
        }

        // Get the staff access token from cookies
        const staffAccessToken = request.cookies.get('staffAccessToken')?.value
        console.log("staffAccessToken: ", staffAccessToken);
        

        if (!staffAccessToken) {
            return NextResponse.json({
                success: false,
                error: 'Authentication token not found'
            }, { status: 401 })
        }

        // Call NestJS backend endpoint
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        const response = await fetch(`${backendUrl}/household-citizen/bulk-save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${staffAccessToken}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            },
            body: JSON.stringify({
                households,
                gnCode: gn_code
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Backend error:', errorText)
            
            return NextResponse.json({
                success: false,
                error: `Backend request failed with status ${response.status}`
            }, { status: response.status })
        }

        const result = await response.json()

        return NextResponse.json({
            success: true,
            message: 'Household data saved successfully',
            savedHouseholds: result.savedHouseholds,
            savedCitizens: result.savedCitizens,
            totalHouseholds: households.length
        })

    } catch (error) {
        console.error('Error saving household data:', error)

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 })
    }
}