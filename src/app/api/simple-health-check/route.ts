import { NextRequest, NextResponse } from 'next/server'

// Simple health check that only tests if the server responds
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { url } = body

        const startTime = Date.now()

        // Use a simple HEAD request to check if server is responding
        // This bypasses CORS for basic connectivity check
        const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        const responseTime = Date.now() - startTime

        return NextResponse.json({
            success: true,
            isReachable: response.status < 500, // Any status < 500 means server is responding
            statusCode: response.status,
            responseTime,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return NextResponse.json({
            success: false,
            isReachable: false,
            statusCode: null,
            responseTime: null,
            error: errorMessage,
            timestamp: new Date().toISOString()
        })
    }
}