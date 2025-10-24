'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface BankAccountResult {
  qr: string
  account: string | null
  accountHolderName: string | null
  branchCode: string | null
  branchName: string | null
  bankCode: string | null
  bankName: string | null
  errorMessage: string | null
}

const BankAccDetails = () => {
  const { theme } = useTheme()
  const [hhNumber, setHhNumber] = useState('')
  const [hhNumbers, setHhNumbers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BankAccountResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')

  useEffect(() => {
    const checkAuth = () => {
      const credentials = sessionStorage.getItem('loginCredentials')
      const wbbPassword = sessionStorage.getItem('wbbPassword')
      const userNIC = sessionStorage.getItem('userNIC')

      if (!credentials || !wbbPassword || !userNIC) {
        setAuthStatus('error')
        setError('User credentials not found. Please login again.')
      } else {
        setAuthStatus('success')
      }
    }

    checkAuth()
  }, [])

  const handleAddHhNumber = () => {
    const trimmedHh = hhNumber.trim()

    if (!trimmedHh) {
      setError('Please enter a HH number')
      return
    }

    if (!trimmedHh.startsWith('HH-')) {
      setError('Invalid HH number format. It should start with "HH-"')
      return
    }

    if (hhNumbers.includes(trimmedHh)) {
      setError('This HH number is already added')
      return
    }

    setHhNumbers([...hhNumbers, trimmedHh])
    setHhNumber('')
    setError(null)
  }

  const handleRemoveHhNumber = (indexToRemove: number) => {
    setHhNumbers(hhNumbers.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddHhNumber()
    }
  }

  const fetchBankDetails = async () => {
    if (hhNumbers.length === 0) {
      setError('Please add at least one HH number')
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      const credentialsStr = sessionStorage.getItem('loginCredentials')
      if (!credentialsStr) {
        throw new Error('User credentials not found')
      }

      const credentials = JSON.parse(credentialsStr)

      const response = await fetch('/api/fetch-bank-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          references: hhNumbers
        })
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 504) {
          throw new Error(`Server timeout. Try with fewer HH numbers (12 or less recommended). Current: ${hhNumbers.length}`)
        }

        throw new Error(errorData.error || `Request failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.results && Array.isArray(data.results)) {
        setResults(data.results)
      } else {
        throw new Error(data.error || 'Invalid response from API')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'

      if (errorMessage.includes('504') || errorMessage.includes('timeout')) {
        setError(`Server timeout. Try with fewer HH numbers (12 or less recommended). Current: ${hhNumbers.length}`)
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const exportToExcel = () => {
    if (results.length === 0) {
      setError('No data to export')
      return
    }

    const headers = [
      'HH Number',
      'Account Number',
      'Account Holder Name',
      'Bank Name',
      'Branch Name',
      'Branch Code',
      'Bank Code',
    ]

    const csvRows = [
      headers.join(','),
      ...results.map(result => [
        result.qr || '',
        result.account || '',
        result.accountHolderName ? `"${result.accountHolderName}"` : '',
        result.bankName ? `"${result.bankName}"` : '',
        result.branchName ? `"${result.branchName}"` : '',
        result.branchCode || '',
        result.bankCode || '',
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `bank_account_details_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (authStatus === 'error') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className={`rounded-lg p-6 text-center ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} border`}>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
              Authentication Required
            </h2>
            <p className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>{error}</p>
            <button
              onClick={() => window.location.href = '/signin'}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Bank Account Details
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            💡 Note: Better to process 12 HH numbers or less to avoid timeout
          </p>
        </div>

        {/* Input Section */}
        <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
            Add HH Numbers
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={hhNumber}
              onChange={(e) => setHhNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter HH number (e.g., HH-1-1-09-03-175-0012)"
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
            />
            <button
              onClick={handleAddHhNumber}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
              } border`}>
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
            </div>
          )}

          {/* HH Numbers List */}
          {hhNumbers.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Added HH Numbers ({hhNumbers.length})
                </h3>
                {hhNumbers.length > 12 && (
                  <span className="text-xs text-amber-500 font-medium">
                    ⚠️ Large batch
                  </span>
                )}
              </div>
              <div className={`max-h-48 overflow-y-auto border rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex flex-wrap gap-2">
                  {hhNumbers.map((hh, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm ${theme === 'dark'
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-700'
                        }`}
                    >
                      <span className="text-sm font-mono">{hh}</span>
                      <button
                        onClick={() => handleRemoveHhNumber(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fetch Button */}
          <div className="mt-6">
            <button
              onClick={fetchBankDetails}
              disabled={isLoading || hhNumbers.length === 0}
              className={`w-full sm:w-auto px-8 py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLoading || hhNumbers.length === 0
                ? theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-400 text-gray-700'
                : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching Details...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Fetch Bank Details
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                Results ({results.length})
              </h2>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export to Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                    <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      HH Number
                    </th>
                    <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Account Number
                    </th>
                    <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Account Holder
                    </th>
                    <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Bank Name
                    </th>
                    <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Branch
                    </th>
                    <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}>
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <td className={`px-4 py-3 font-mono text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.qr}
                      </td>
                      <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.account || '-'}
                      </td>
                      <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.accountHolderName || '-'}
                      </td>
                      <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.bankName || '-'}
                      </td>
                      <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.branchName || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {result.errorMessage ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Error
                          </span>
                        ) : result.account ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Success
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                            No Data
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BankAccDetails