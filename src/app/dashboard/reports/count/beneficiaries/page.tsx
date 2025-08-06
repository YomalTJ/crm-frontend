'use client'

import { useTheme } from '@/context/ThemeContext'
import React, { useState, useEffect } from 'react'
import { getSamurdhiFamilyCount, SamurdhiFamilyCountResult, SamurdhiFamilyCountParams } from '@/services/reportsService'

// Hardcoded data for now - will be replaced with API calls in future
const DISTRICTS = [
  { id: '1', name: 'Colombo' }
]

const DS_OPTIONS = [
  { id: '1', name: 'Homagama/හෝමගම/ஹோமாகம', districtId: '1' },
  { id: '9', name: 'Kaduwela/කඩුවෙල/கடுவெல', districtId: '1' }
]

const ZONE_OPTIONS = [
  { id: '1', name: 'MEEGODA/මීගොඩ/MEEGODA', dsId: '1' },
  { id: '3', name: 'Battaramulla/බත්තරමුල්ල/பத்தரமுல்ல', dsId: '9' }
]

const GND_OPTIONS = [
  { id: '1', name: 'Kottawa', zoneId: '1' },
  { id: '175', name: 'Udumulla/උඩුමුල්ල/உடுமுல்ல', zoneId: '3' }
]

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

  // Filter states
  const [filters, setFilters] = useState<SamurdhiFamilyCountParams>({
    district_id: '1' // Default to Colombo
  })

  const [availableDS, setAvailableDS] = useState(DS_OPTIONS)
  const [availableZones, setAvailableZones] = useState<typeof ZONE_OPTIONS>([])
  const [availableGNDs, setAvailableGNDs] = useState<typeof GND_OPTIONS>([])

  // Update dependent dropdowns when parent changes
  useEffect(() => {
    if (filters.district_id) {
      setAvailableDS(DS_OPTIONS.filter(ds => ds.districtId === filters.district_id))
      // Reset dependent filters
      setFilters(prev => ({ ...prev, ds_id: '', zone_id: '', gnd_id: '' }))
      setAvailableZones([])
      setAvailableGNDs([])
    }
  }, [filters.district_id])

  useEffect(() => {
    if (filters.ds_id) {
      setAvailableZones(ZONE_OPTIONS.filter(zone => zone.dsId === filters.ds_id))
      // Reset dependent filters
      setFilters(prev => ({ ...prev, zone_id: '', gnd_id: '' }))
      setAvailableGNDs([])
    }
  }, [filters.ds_id])

  useEffect(() => {
    if (filters.zone_id) {
      setAvailableGNDs(GND_OPTIONS.filter(gnd => gnd.zoneId === filters.zone_id))
      // Reset dependent filter
      setFilters(prev => ({ ...prev, gnd_id: '' }))
    }
  }, [filters.zone_id])

  // Fetch data when filters change
  useEffect(() => {
    if (filters.district_id) {
      fetchData()
    }
  }, [filters])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getSamurdhiFamilyCount(filters)
      setResults(response.results)
      setTotalCount(response.totalCount)
    } catch (err) {
      setError('Failed to fetch beneficiary count data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SamurdhiFamilyCountParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const clearFilters = () => {
    setFilters({ district_id: '1' })
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
    const selectedDistrict = DISTRICTS.find(d => d.id === filters.district_id)
    const selectedDS = availableDS.find(ds => ds.id === filters.ds_id)
    const selectedZone = availableZones.find(z => z.id === filters.zone_id)
    const selectedGND = availableGNDs.find(g => g.id === filters.gnd_id)

    if (filters.gnd_id && selectedGND && selectedZone && selectedDS && selectedDistrict) {
      return `Total beneficiaries in ${selectedGND.name}, ${selectedZone.name}, ${selectedDS.name} of ${selectedDistrict.name} is`
    }

    if (filters.zone_id && selectedZone && selectedDS && selectedDistrict) {
      return `Total beneficiaries in ${selectedZone.name}, ${selectedDS.name} of ${selectedDistrict.name} is`
    }

    if (filters.ds_id && selectedDS && selectedDistrict) {
      return `Total beneficiaries in ${selectedDS.name} of ${selectedDistrict.name} is`
    }

    if (filters.district_id && selectedDistrict) {
      return `Total beneficiaries in ${selectedDistrict.name} is`
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* District */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                District
              </label>
              <select
                value={filters.district_id || ''}
                onChange={(e) => handleFilterChange('district_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textPrimary}`}
              >
                <option value="">All Districts</option>
                {DISTRICTS.map(district => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DS */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Divisional Secretariat
              </label>
              <select
                value={filters.ds_id || ''}
                onChange={(e) => handleFilterChange('ds_id', e.target.value)}
                disabled={!filters.district_id}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textPrimary} disabled:opacity-50`}
              >
                <option value="">All DS</option>
                {availableDS.map(ds => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Zone
              </label>
              <select
                value={filters.zone_id || ''}
                onChange={(e) => handleFilterChange('zone_id', e.target.value)}
                disabled={!filters.ds_id}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textPrimary} disabled:opacity-50`}
              >
                <option value="">All Zones</option>
                {availableZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GND */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                GND Division
              </label>
              <select
                value={filters.gnd_id || ''}
                onChange={(e) => handleFilterChange('gnd_id', e.target.value)}
                disabled={!filters.zone_id}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textPrimary} disabled:opacity-50`}
              >
                <option value="">All GNDs</option>
                {availableGNDs.map(gnd => (
                  <option key={gnd.id} value={gnd.id}>
                    {gnd.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Program */}
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>
                Main Program
              </label>
              <select
                value={filters.mainProgram || ''}
                onChange={(e) => handleFilterChange('mainProgram', e.target.value)}
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

            {/* Clear Filters */}
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