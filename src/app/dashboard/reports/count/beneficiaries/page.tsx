/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useTheme } from '@/context/ThemeContext'
import React, { useState, useEffect } from 'react'
import { getSamurdhiFamilyCountWithLocations, SamurdhiFamilyCountResult, SamurdhiFamilyCountParams } from '@/services/reportsService'
import { getAccessibleLocations, AccessibleLocations } from '@/services/projectDetailReportService'
import LocationDropdowns from '@/components/form-fields/LocationDropdowns'

const MAIN_PROGRAMS = [
  { value: 'NP', label: 'National Program' },
  { value: 'ADB', label: 'ADB Program' },
  { value: 'WB', label: 'World Bank Program' },
]

const BeneficiariesCountReports = () => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SamurdhiFamilyCountResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [accessibleLocations, setAccessibleLocations] = useState<AccessibleLocations | null>(null)

  // Filter states
  const [filters, setFilters] = useState<SamurdhiFamilyCountParams>({})

  // Get user's default location filters based on accessible locations
  const getUserDefaultLocation = (locations: AccessibleLocations): SamurdhiFamilyCountParams => {
    const defaultFilters: SamurdhiFamilyCountParams = {};

    // If user has access to only one location at each level, use that as default
    if (locations.districts.length === 1) {
      defaultFilters.district_id = locations.districts[0].district_id.toString();
    }
    if (locations.dss.length === 1) {
      defaultFilters.ds_id = locations.dss[0].ds_id.toString();
    }
    if (locations.zones.length === 1) {
      defaultFilters.zone_id = locations.zones[0].zone_id.toString();
    }
    if (locations.gndDivisions.length === 1) {
      defaultFilters.gnd_id = locations.gndDivisions[0].gnd_id;
    }

    return defaultFilters;
  };

  // Load accessible locations on component mount and set initial filters
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true)
        const locations = await getAccessibleLocations()
        setAccessibleLocations(locations)

        // Set initial filters based on user's accessible locations
        const defaultFilters = getUserDefaultLocation(locations)
        setFilters(defaultFilters)
      } catch (err) {
        setError('Failed to load location data')
        console.error('Error loading locations:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [])

  // Fetch data when filters change
  useEffect(() => {
    if (accessibleLocations) {
      fetchData()
    }
  }, [filters, accessibleLocations])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getSamurdhiFamilyCountWithLocations(filters)
      setResults(response.countData.results)
      setTotalCount(response.countData.totalCount)
    } catch (err) {
      setError('Failed to fetch beneficiary count data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters };

    if (value === '') {
      delete newFilters[key as keyof SamurdhiFamilyCountParams];
    } else {
      if (key === 'mainProgram') {
        if (value === 'NP' || value === 'ADB' || value === 'WB') {
          newFilters[key as keyof SamurdhiFamilyCountParams] = value as any;
        }
      } else {
        newFilters[key as keyof SamurdhiFamilyCountParams] = value as any;
      }
    }

    // Clear dependent filters when parent changes
    if (key === 'district_id') {
      delete newFilters.ds_id;
      delete newFilters.zone_id;
      delete newFilters.gnd_id;
    } else if (key === 'ds_id') {
      delete newFilters.zone_id;
      delete newFilters.gnd_id;
    } else if (key === 'zone_id') {
      delete newFilters.gnd_id;
    }

    setFilters(newFilters);
  };

  const clearFilters = () => {
    // Instead of clearing all filters, reset to user's default location
    if (accessibleLocations) {
      const defaultFilters = getUserDefaultLocation(accessibleLocations)
      setFilters(defaultFilters)
    } else {
      setFilters({})
    }
  }

  const exportData = () => {
    if (results.length === 0) return

    const csv = [
      ['District', 'DS', 'Zone', 'GND Name', 'Count'],
      ...results.map(row => [
        row.districtName,
        row.dsName,
        row.zoneName,
        row.gndName,
        row.count
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'samurdhi_beneficiary_count_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTotalBeneficiariesText = () => {
    const selectedDistrict = accessibleLocations?.districts.find(d => d.district_id.toString() === filters.district_id)
    const selectedDS = accessibleLocations?.dss.find(ds => ds.ds_id.toString() === filters.ds_id)
    const selectedZone = accessibleLocations?.zones.find(z => z.zone_id.toString() === filters.zone_id)
    const selectedGND = accessibleLocations?.gndDivisions.find(g => g.gnd_id === filters.gnd_id)

    if (filters.gnd_id && selectedGND && selectedZone && selectedDS && selectedDistrict) {
      return `Total beneficiaries in ${selectedGND.gnd_name}, ${selectedZone.zone_name}, ${selectedDS.ds_name} of ${selectedDistrict.district_name} is`
    }

    if (filters.zone_id && selectedZone && selectedDS && selectedDistrict) {
      return `Total beneficiaries in ${selectedZone.zone_name}, ${selectedDS.ds_name} of ${selectedDistrict.district_name} is`
    }

    if (filters.ds_id && selectedDS && selectedDistrict) {
      return `Total beneficiaries in ${selectedDS.ds_name} of ${selectedDistrict.district_name} is`
    }

    if (filters.district_id && selectedDistrict) {
      return `Total beneficiaries in ${selectedDistrict.district_name} is`
    }

    return 'Total beneficiaries is'
  }

  const isDark = theme === 'dark'
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600'
  const inputBg = isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'

  return (
    <div className={`min-h-screen p-4 md:p-0 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} flex items-center gap-2`}>
              Samurdhi Beneficiaries Count Report
            </h1>
            <p className={`${textSecondary} mt-2`}>
              View and analyze beneficiary counts across different administrative levels
            </p>
          </div>

          <button
            onClick={exportData}
            disabled={results.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${results.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            Export Data
          </button>
        </div>

        {/* Filters */}
        <div className={`${cardBg} border rounded-lg p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className={`text-lg font-semibold ${textPrimary}`}>Filters</h2>
          </div>

          {/* Location Filter Cards */}
          {accessibleLocations && (
            <LocationDropdowns
              accessibleLocations={accessibleLocations}
              filters={filters}
              updateFilter={updateFilter}
            />
          )}

          {/* Program Filter and Clear Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Main Program
              </label>
              <select
                value={filters.mainProgram || ''}
                onChange={(e) => updateFilter('mainProgram', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textPrimary}`}
              >
                <option value="">All Programs</option>
                {MAIN_PROGRAMS.map(program => (
                  <option key={program.value} value={program.value}>
                    {program.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-white hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${cardBg} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>{getTotalBeneficiariesText()}</p>
                <p className={`${textPrimary} text-2xl font-bold`}>{totalCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>GND Divisions</p>
                <p className={`${textPrimary} text-2xl font-bold`}>{results.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className={`${cardBg} border rounded-lg overflow-hidden`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${textPrimary}`}>Results</h2>
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className={`text-sm ${textSecondary}`}>Loading...</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-6 text-center">
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="p-12 text-center">
              <p className={`${textSecondary} text-lg`}>No data found</p>
              <p className={`${textSecondary} text-sm mt-2`}>
                Try adjusting your filters to see results
              </p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider hidden xl:table-cell`}>
                      District
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider hidden lg:table-cell`}>
                      DS Division
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                      Zone
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                      GND Division
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-medium ${textSecondary} uppercase tracking-wider`}>
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {results.map((result, index) => (
                    <tr key={`${result.gndId}-${index}`} className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${textPrimary} hidden xl:table-cell`}>
                        {result.districtName}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textPrimary} hidden lg:table-cell`}>
                        {result.dsName}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textPrimary}`}>
                        {result.zoneName}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${textPrimary}`}>
                        <div>
                          <div className="font-medium">{result.gndName}</div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${textPrimary}`}>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {parseInt(result.count).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BeneficiariesCountReports