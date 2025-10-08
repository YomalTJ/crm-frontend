/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, password, references } = body

        // Validate required fields
        if (!username || !password) {
            return NextResponse.json({
                success: false,
                error: 'Username and password are required'
            }, { status: 400 })
        }

        if (!references || !Array.isArray(references) || references.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'References array is required and must contain at least one HH number'
            }, { status: 400 })
        }

        // Step 1: Login to WBB API to get access token
        const loginResponse = await fetch('https://api.wbb.gov.lk/api/samurthi/AuthSamurthi/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        if (!loginResponse.ok) {
            const loginError = await loginResponse.text()
            console.error('Login failed:', loginError)
            return NextResponse.json({
                success: false,
                error: `Login failed with status: ${loginResponse.status}`,
                details: loginError
            }, { status: loginResponse.status })
        }

        const loginData = await loginResponse.json()
        const accessToken = loginData?.token?.accessToken

        if (!accessToken) {
            console.error('Login response:', JSON.stringify(loginData, null, 2))
            return NextResponse.json({
                success: false,
                error: 'Failed to get access token from login response',
                loginResponse: loginData
            }, { status: 400 })
        }

        // Step 2: Fetch bank account details using the access token
        const bankDetailsResponse = await fetch('https://api.wbb.gov.lk/api/Samurthis/BankAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                references
            })
        })

        if (!bankDetailsResponse.ok) {
            const bankError = await bankDetailsResponse.text()
            console.error('Bank details fetch failed:', bankError)
            return NextResponse.json({
                success: false,
                error: `Failed to fetch bank details with status: ${bankDetailsResponse.status}`,
                details: bankError
            }, { status: bankDetailsResponse.status })
        }

        const bankData = await bankDetailsResponse.json()

        // Validate response structure
        if (!bankData.results || !Array.isArray(bankData.results)) {
            console.error('Invalid bank data structure:', JSON.stringify(bankData, null, 2))
            return NextResponse.json({
                success: false,
                error: 'Invalid response format from bank details API',
                receivedData: bankData
            }, { status: 500 })
        }

        // Process results and make error messages user-friendly
        const processedResults = bankData.results.map((result: any) => {
            // If there's an error message, make it user-friendly
            if (result.errorMessage) {
                let friendlyError = 'Bank account information not available'

                // Check for common error patterns and provide better messages
                if (result.errorMessage.includes('LINQ query') ||
                    result.errorMessage.includes('exception') ||
                    result.errorMessage.includes('EnableSensitiveDataLogging')) {
                    friendlyError = 'No bank account record found for this HH number'
                } else if (result.errorMessage.includes('timeout')) {
                    friendlyError = 'Request timed out. Please try again'
                } else if (result.errorMessage.includes('connection')) {
                    friendlyError = 'Connection error. Please check your network'
                } else if (result.errorMessage.includes('not found')) {
                    friendlyError = 'HH number not found in the system'
                } else if (result.errorMessage.includes('unauthorized') ||
                    result.errorMessage.includes('authentication')) {
                    friendlyError = 'Authentication error. Please login again'
                }

                return {
                    ...result,
                    errorMessage: friendlyError,
                    originalError: result.errorMessage // Keep original for debugging
                }
            }

            // If no account but no error, it means the record exists but no bank account linked
            if (!result.account && !result.errorMessage) {
                return {
                    ...result,
                    errorMessage: 'No bank account linked to this HH number'
                }
            }

            return result
        })

        // Return successful response with bank account details
        return NextResponse.json({
            success: true,
            results: processedResults,
            totalRecords: processedResults.length,
            successCount: processedResults.filter((r: any) => r.account && !r.errorMessage).length,
            errorCount: processedResults.filter((r: any) => r.errorMessage).length,
            noDataCount: processedResults.filter((r: any) => !r.account && !r.errorMessage).length
        })

    } catch (error) {
        console.error('Proxy API error:', error)

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}