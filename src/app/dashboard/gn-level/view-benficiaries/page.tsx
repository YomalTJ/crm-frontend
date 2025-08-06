'use client'

import { useTheme } from '@/context/ThemeContext'
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Beneficiary, BeneficiaryFilters, deleteBeneficiary, getBeneficiaries } from '@/services/benficiaryService'

const ViewBeneficiaries = () => {
  const { theme } = useTheme()
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  
  // Filter states
  const [filters, setFilters] = useState<BeneficiaryFilters>({
    page: 1,
    limit: 10
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [mainProgramFilter, setMainProgramFilter] = useState<string>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const fetchBeneficiaries = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getBeneficiaries(filters)
      setBeneficiaries(response.data)
      setTotalPages(response.meta.last_page)
      setTotalRecords(response.meta.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch beneficiaries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBeneficiaries()
  }, [filters])

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      search: searchTerm.trim() || undefined
    }))
  }

  const handleFilterApply = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mainProgram: mainProgramFilter as any || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined
    }))
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setMainProgramFilter('')
    setFromDate('')
    setToDate('')
    setFilters({ page: 1, limit: 10 })
    setShowFilters(false)
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    setCurrentPage(page)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete beneficiary "${name}"?`)) {
      try {
        await deleteBeneficiary(id)
        fetchBeneficiaries() // Refresh the list
      } catch {
        alert('Failed to delete beneficiary')
      }
    }
  }

  const handleEdit = (beneficiary: Beneficiary) => {
    // TODO: Implement edit functionality
    console.log('Edit beneficiary:', beneficiary)
    // You can add your edit logic here
  }

  const handleAddNew = () => {
    // TODO: Implement add new functionality
    console.log('Add new beneficiary')
    // You can add your add new logic here
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProgramBadgeColor = (program: string) => {
    switch (program) {
      case 'NP': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'ADB': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'WB': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded flex items-center ${
            currentPage === 1 
              ? 'opacity-50 cursor-not-allowed' 
              : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded flex items-center ${
            currentPage === totalPages 
              ? 'opacity-50 cursor-not-allowed' 
              : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              View All Beneficiaries
            </h1>
            <button
              onClick={handleAddNew}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Beneficiary
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, NIC, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className={`mt-4 p-4 border rounded-md ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Main Program
                  </label>
                  <select
                    value={mainProgramFilter}
                    onChange={(e) => setMainProgramFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Programs</option>
                    <option value="NP">NP</option>
                    <option value="ADB">ADB</option>
                    <option value="WB">WB</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleFilterApply}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading beneficiaries...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchBeneficiaries}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : beneficiaries.length === 0 ? (
            <div className="text-center py-8">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                No beneficiaries found.
              </p>
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Showing {beneficiaries.length} of {totalRecords} beneficiaries
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Contact
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Address
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Employment
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Program
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Created
                      </th>
                      <th className={`text-center py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaries.map((beneficiary) => (
                      <tr
                        key={beneficiary.id}
                        className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                      >
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          <div>
                            <div className="font-medium">{beneficiary.beneficiaryName}</div>
                            {beneficiary.nic && (
                              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                NIC: {beneficiary.nic}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="text-sm">
                            <div>{beneficiary.phone}</div>
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="text-sm max-w-xs truncate" title={beneficiary.address}>
                            {beneficiary.address}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {beneficiary.zone}
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="text-sm">{beneficiary.currentEmployment}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramBadgeColor(beneficiary.mainProgram)}`}>
                            {beneficiary.mainProgram}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div>{formatDate(beneficiary.createdAt)}</div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            by {beneficiary.createdBy}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(beneficiary)}
                              className={`p-2 rounded-md transition-colors ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:bg-gray-600' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title="Edit beneficiary"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(beneficiary.id, beneficiary.beneficiaryName)}
                              className={`p-2 rounded-md transition-colors ${
                                theme === 'dark' 
                                  ? 'text-red-400 hover:bg-gray-600' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title="Delete beneficiary"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewBeneficiaries