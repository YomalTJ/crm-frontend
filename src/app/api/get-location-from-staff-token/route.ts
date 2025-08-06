import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const staffToken = cookieStore.get('staffAccessToken')?.value

        if (!staffToken) {
            return NextResponse.json({
                success: false,
                error: 'Staff token not found'
            }, { status: 404 })
        }

        // Decode the JWT token to get location code
        try {
            const payloadBase64 = staffToken.split('.')[1]
            const decodedPayload = JSON.parse(atob(payloadBase64))

            const locationCode = decodedPayload?.locationCode || decodedPayload?.location_code

            if (!locationCode) {
                return NextResponse.json({
                    success: false,
                    error: 'Location code not found in staff token',
                    payload: decodedPayload
                }, { status: 400 })
            }

            return NextResponse.json({
                success: true,
                locationCode: locationCode
            })

        } catch (decodeError) {
            return NextResponse.json({
                success: false,
                error: 'Failed to decode staff token',
                details: decodeError instanceof Error ? decodeError.message : 'Unknown decode error'
            }, { status: 400 })
        }

    } catch (error) {
        console.error('Get location error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}