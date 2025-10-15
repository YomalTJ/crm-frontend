'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

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

interface StaffLocation {
  provinceId: number
  district: {
    id: number
    name: string
  }
  dsDivision: {
    id: number
    name: string
  }
  zone: {
    id: number
    name: string
  }
  gnd: {
    id: string
    name: string
  }
}

const levelNames: { [key: number]: string } = {
  1: 'Poor',
  2: 'Severely Poor',
  3: 'Transient',
  4: 'Vulnerable'
}

const HouseholdDetails = () => {
  const { theme } = useTheme()
  const [households, setHouseholds] = useState<HouseholdData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [staffLocation, setStaffLocation] = useState<StaffLocation | null>(null)
  const [gnCode, setGnCode] = useState<string>('')
  const [level, setLevel] = useState<number>(2)

  useEffect(() => {
    const locationData = localStorage.getItem('staffLocation')

    if (locationData) {
      try {
        const location = JSON.parse(locationData)
        setStaffLocation(location)

        const gnCode = location.gnd.id
        setGnCode(gnCode)
      } catch (err) {
        console.error("Failed to parse staff location data:", err)
        setError('Failed to parse staff location data')
      }
    } else {
      setError('Staff location not found in localStorage')
    }
  }, [])

  const fetchHouseholdData = async () => {
    if (!gnCode) {
      setError('GN Code not available')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/fetch-household-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gn_code: gnCode,
          level: level
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setHouseholds(result.data)
        setSuccess(`Successfully fetched ${result.data.length} households`)
      } else {
        setError(result.error || 'Failed to fetch household data')
      }
    } catch {
      setError('Network error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  const saveToDatabase = async () => {
    if (households.length === 0) {
      setError('No household data to save')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/save-household-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          households,
          gn_code: gnCode
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSuccess(`Successfully saved ${result.savedHouseholds} households and ${result.savedCitizens} citizens to database`)
      } else {
        setError(result.error || 'Failed to save data to database')
      }
    } catch {
      setError('Network error occurred while saving data')
    } finally {
      setLoading(false)
    }
  }

  // Get the current level name for display
  const currentLevelName = levelNames[level] || `Level ${level}`

  return (
    <div>
      <h1 className={`text-3xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Get Household Details From WBB
      </h1>

      {/* Staff Location Info */}
      {staffLocation && (
        <div className={`p-4 rounded-lg border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            GND Officer Location
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                District
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {staffLocation.district.name}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                DS Division
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {staffLocation.dsDivision.name}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Zone
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {staffLocation.zone.name}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                GND
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {staffLocation.gnd.name}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              GND Code
            </span>
            <span className={`text-lg font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {gnCode}
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`p-4 rounded-lg border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-col gap-2">
            <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className={`px-3 py-2 rounded border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value={1}>Poor</option>
              <option value={2}>Severely Poor</option>
              <option value={3}>Transient</option>
              <option value={4}>Vulnerable</option>
            </select>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter level to get data
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-1 w-full md:w-auto">
            <button
              onClick={fetchHouseholdData}
              disabled={loading || !gnCode}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${loading || !gnCode
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
              {loading ? 'Fetching...' : `Fetch ${currentLevelName} Data`}
            </button>

            <button
              onClick={saveToDatabase}
              disabled={loading || households.length === 0}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${loading || households.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
                } text-white`}
            >
              {loading ? 'Saving...' : 'Save to Database'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 rounded-lg border border-red-300 bg-red-50 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border border-green-300 bg-green-50 mb-6">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Household Data Display */}
      {households.length > 0 && (
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Fetched Household Data - {currentLevelName} ({households.length} households)
          </h2>

          {households.map((household) => (
            <div
              key={household.hH_reference}
              className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="mb-4">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {household.applicant_name}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {household.hH_reference}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Address
                  </span>
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    <p>{household.addressLine_1}</p>
                    {household.addressLine_2 && <p>{household.addressLine_2}</p>}
                    {household.addressLine_3 && <p>{household.addressLine_3}</p>}
                  </div>
                </div>
                <div>
                  <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Details
                  </span>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>Single Mother: {household.single_Mother}</p>
                    <p>Level: {levelNames[household.level] || household.level}</p>
                    <p>Citizens: {household.citizens.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Citizens
                </span>
                <div className="space-y-2">
                  {household.citizens.map((citizen, citizenIndex) => (
                    <div
                      key={citizenIndex}
                      className={`p-3 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {citizen.name}
                          </span>
                        </div>
                        <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Age: {citizen.age}
                        </div>
                        <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Gender: {citizen.gender}
                        </div>
                        <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          DOB: {new Date(citizen.date_of_Birth).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HouseholdDetails