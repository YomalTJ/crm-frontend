// app/api/save-household-data/route.ts
import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'your_database_name',
    port: parseInt(process.env.DB_PORT || '3306')
}

interface Citizen {
    name: string
    date_of_Birth: string
    age: number
    gender: 'male' | 'female' | 'other'
}

interface HouseholdData {
    hH_reference: string
    applicant_name: string
    addressLine_1: string
    addressLine_2: string
    addressLine_3: string
    single_Mother: string
    citizens: Citizen[]
    level: number
}

export async function POST(request: NextRequest) {
    let connection: mysql.Connection | null = null

    try {
        const body = await request.json()
        const { households, gn_code }: { households: HouseholdData[], gn_code: string } = body

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

        // Create database connection
        connection = await mysql.createConnection(dbConfig)

        // Start transaction
        await connection.beginTransaction()

        let savedHouseholds = 0
        let savedCitizens = 0

        for (const household of households) {
            try {
                // Insert household data
                const householdQuery = `
                    INSERT INTO households 
                    (hh_reference, gn_code, applicant_name, address_line_1, address_line_2, address_line_3, single_mother, level)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    gn_code = VALUES(gn_code),
                    applicant_name = VALUES(applicant_name),
                    address_line_1 = VALUES(address_line_1),
                    address_line_2 = VALUES(address_line_2),
                    address_line_3 = VALUES(address_line_3),
                    single_mother = VALUES(single_mother),
                    level = VALUES(level),
                    updated_at = CURRENT_TIMESTAMP
                `

                const householdValues = [
                    household.hH_reference,
                    gn_code,
                    household.applicant_name,
                    household.addressLine_1 || null,
                    household.addressLine_2 || null,
                    household.addressLine_3 || null,
                    household.single_Mother === 'Yes' ? 'Yes' : 'No',
                    household.level
                ]

                await connection.execute(householdQuery, householdValues)
                savedHouseholds++

                // Delete existing citizens for this household to avoid duplicates
                const deleteCitizensQuery = 'DELETE FROM citizens WHERE hh_reference = ?'
                await connection.execute(deleteCitizensQuery, [household.hH_reference])

                // Insert citizens
                if (household.citizens && household.citizens.length > 0) {
                    const citizenQuery = `
                        INSERT INTO citizens 
                        (hh_reference, name, date_of_birth, age, gender)
                        VALUES (?, ?, ?, ?, ?)
                    `

                    for (const citizen of household.citizens) {
                        // Parse and format the date
                        const dateOfBirth = new Date(citizen.date_of_Birth)
                        const formattedDate = dateOfBirth.toISOString().split('T')[0] // Format as YYYY-MM-DD

                        // Validate gender
                        let gender: 'male' | 'female' | 'other' = 'other'
                        if (citizen.gender === 'male' || citizen.gender === 'female') {
                            gender = citizen.gender
                        }

                        const citizenValues = [
                            household.hH_reference,
                            citizen.name,
                            formattedDate,
                            citizen.age,
                            gender
                        ]

                        await connection.execute(citizenQuery, citizenValues)
                        savedCitizens++
                    }
                }

            } catch (householdError) {
                console.error(`Error saving household ${household.hH_reference}:`, householdError)
                // Continue with next household rather than failing entire batch
            }
        }

        // Commit transaction
        await connection.commit()

        return NextResponse.json({
            success: true,
            message: 'Household data saved successfully',
            savedHouseholds,
            savedCitizens,
            totalHouseholds: households.length
        })

    } catch (error) {
        console.error('Database error:', error)

        // Rollback transaction if connection exists
        if (connection) {
            try {
                await connection.rollback()
            } catch (rollbackError) {
                console.error('Rollback error:', rollbackError)
            }
        }

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Database error occurred'
        }, { status: 500 })

    } finally {
        // Close connection
        if (connection) {
            try {
                await connection.end()
            } catch (closeError) {
                console.error('Error closing connection:', closeError)
            }
        }
    }
}