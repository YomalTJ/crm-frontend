'use client'

import { useTheme } from '@/context/ThemeContext'
import React, { useState, useEffect } from 'react'

interface ApiEndpoint {
    name: string
    url: string
    method: 'GET' | 'POST'
    status: 'checking' | 'online' | 'offline' | 'error'
    responseTime: number | null
    lastChecked: Date | null
    statusCode: number | null
    testPayload?: unknown
    queryParams?: Record<string, string | number>
    requiresAuth?: boolean
    authToken?: string | null
}

const ApiStatus = () => {
    const { theme } = useTheme()
    const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
        {
            name: 'User Login',
            url: 'https://api.wbb.gov.lk/api/samurthi/AuthSamurthi/login',
            method: 'POST',
            status: 'checking',
            responseTime: null,
            lastChecked: null,
            statusCode: null,
            testPayload: null // Will be set dynamically
        },
        {
            name: 'Get Household Details',
            url: 'https://api.wbb.gov.lk/api/Samurthis/GetByGn',
            method: 'POST',
            status: 'checking',
            responseTime: null,
            lastChecked: null,
            statusCode: null,
            requiresAuth: true,
            authToken: null,
            queryParams: undefined // Will be set dynamically
        }
    ])

    const [isChecking, setIsChecking] = useState(false)
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState(30) // seconds
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [userCredentials, setUserCredentials] = useState<{username: string, password: string} | null>(null)
    const [locationCode, setLocationCode] = useState<string | null>(null)

    // Get user credentials from login form (stored in sessionStorage or passed as props)
    useEffect(() => {
        const getStoredCredentials = () => {
            try {
                const stored = sessionStorage.getItem('loginCredentials')
                if (stored) {
                    const creds = JSON.parse(stored)
                    setUserCredentials(creds)
                    
                    // Update the login endpoint payload
                    setEndpoints(prev => prev.map(ep => 
                        ep.name === 'User Login' 
                            ? { ...ep, testPayload: { username: creds.username, password: creds.password } }
                            : ep
                    ))
                }
            } catch (error) {
                console.error('Failed to get stored credentials:', error)
            }
        }

        getStoredCredentials()
    }, [])

    // Get location code from staff token
    useEffect(() => {
        const getLocationCode = async () => {
            try {
                const response = await fetch('/api/get-location-from-staff-token')
                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setLocationCode(result.locationCode)
                        
                        // Update the GetByGn endpoint with location code
                        setEndpoints(prev => prev.map(ep => 
                            ep.name === 'Get Household Details'
                                ? { 
                                    ...ep, 
                                    queryParams: { 
                                        gn_code: result.locationCode, 
                                        level: 2 
                                    } 
                                }
                                : ep
                        ))
                    } else {
                        console.warn('Failed to get location code:', result.error)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch location code:', error)
            }
        }

        getLocationCode()
    }, [])

    // Function to get auth token from login endpoint
    const getAuthToken = async (): Promise<string | null> => {
        try {
            const response = await fetch('/api/get-auth-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCredentials || {})
            })

            if (response.ok) {
                const result = await response.json()
                if (result.success && result.accessToken) {
                    setAuthToken(result.accessToken)
                    return result.accessToken
                }
            }
            return null
        } catch (error) {
            console.error('Failed to get auth token:', error)
            return null
        }
    }

    const checkApiStatus = async (endpoint: ApiEndpoint): Promise<ApiEndpoint> => {
        const startTime = Date.now()

        try {
            // If endpoint requires auth and we don't have a token, get one first
            if (endpoint.requiresAuth && !authToken) {
                const token = await getAuthToken()
                if (!token) {
                    return {
                        ...endpoint,
                        status: 'error',
                        responseTime: Date.now() - startTime,
                        lastChecked: new Date(),
                        statusCode: 401
                    }
                }
            }

            // Make the API call through our proxy
            const response = await fetch('/api/check-external-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: endpoint.url,
                    method: endpoint.method,
                    payload: endpoint.testPayload,
                    queryParams: endpoint.queryParams,
                    requiresAuth: endpoint.requiresAuth,
                    authToken: endpoint.requiresAuth ? authToken : undefined,
                    userCredentials: userCredentials // Pass user credentials
                })
            })

            const responseTime = Date.now() - startTime

            if (response.ok) {
                const result = await response.json()

                // If this is the login endpoint and it was successful, store the token
                if (endpoint.name === 'User Login' && result.success && result.data?.token?.accessToken) {
                    setAuthToken(result.data.token.accessToken)
                }

                return {
                    ...endpoint,
                    status: result.success ? 'online' : result.statusCode === 401 ? 'error' : 'offline',
                    responseTime,
                    lastChecked: new Date(),
                    statusCode: result.statusCode,
                    authToken: result.data?.token?.accessToken || endpoint.authToken
                }
            } else {
                throw new Error('Proxy failed')
            }
        } catch (error) {
            console.error(`API ${endpoint.name} check failed:`, error)

            // Fallback to simple health check
            try {
                const healthResponse = await fetch('/api/simple-health-check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: endpoint.url })
                })

                if (healthResponse.ok) {
                    const result = await healthResponse.json()
                    const responseTime = Date.now() - startTime

                    return {
                        ...endpoint,
                        status: result.isReachable ? 'online' : 'offline',
                        responseTime: result.responseTime || responseTime,
                        lastChecked: new Date(),
                        statusCode: result.statusCode
                    }
                }
            } catch (healthError) {
                console.log(`Health check failed for ${endpoint.name}:`, healthError)
            }

            // Final fallback - mark as offline
            const responseTime = Date.now() - startTime
            return {
                ...endpoint,
                status: 'offline',
                responseTime,
                lastChecked: new Date(),
                statusCode: null
            }
        }
    }

    const checkAllApis = async () => {
        setIsChecking(true)

        // Check login endpoint first to get auth token
        const loginEndpoint = endpoints.find(ep => ep.name === 'User Login')
        if (loginEndpoint) {
            const updatedLogin = await checkApiStatus(loginEndpoint)
            setEndpoints(prev => prev.map(ep =>
                ep.name === 'User Login' ? updatedLogin : ep
            ))
        }

        // Then check other endpoints
        const otherEndpoints = endpoints.filter(ep => ep.name !== 'User Login')
        const updatedEndpoints = await Promise.all(
            otherEndpoints.map(endpoint => checkApiStatus(endpoint))
        )

        // Update all endpoints
        setEndpoints(prev => prev.map(ep => {
            if (ep.name === 'User Login') return ep // Already updated above
            const updated = updatedEndpoints.find(updated => updated.name === ep.name)
            return updated || ep
        }))

        setIsChecking(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-500'
            case 'offline':
                return 'bg-red-500'
            case 'error':
                return 'bg-yellow-500'
            case 'checking':
                return 'bg-blue-500 animate-pulse'
            default:
                return 'bg-gray-500'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'online':
                return 'Online'
            case 'offline':
                return 'Offline'
            case 'error':
                return 'Error'
            case 'checking':
                return 'Checking...'
            default:
                return 'Unknown'
        }
    }

    const formatResponseTime = (time: number | null) => {
        if (time === null) return 'N/A'
        return `${time}ms`
    }

    const formatLastChecked = (date: Date | null) => {
        if (!date) return 'Never'
        return date.toLocaleTimeString()
    }

    // Auto refresh functionality
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (autoRefresh) {
            interval = setInterval(() => {
                checkAllApis()
            }, refreshInterval * 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [autoRefresh, refreshInterval])

    // Initial check on component mount (only after credentials and location are loaded)
    useEffect(() => {
        if (userCredentials || locationCode) {
            checkAllApis()
        }
    }, [userCredentials, locationCode])

    return (
        <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                API Status Monitor
            </h1>

            <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-10">
                {/* Configuration Status */}
                <div className={`p-4 sm:p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                    <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Configuration Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                User Credentials
                            </span>
                            <span className={`${userCredentials ? 'text-green-600' : 'text-red-600'}`}>
                                {userCredentials ? `✓ Loaded (${userCredentials.username})` : '✗ Not Found'}
                            </span>
                        </div>
                        <div>
                            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Location Code
                            </span>
                            <span className={`${locationCode ? 'text-green-600' : 'text-red-600'}`}>
                                {locationCode ? `✓ ${locationCode}` : '✗ Not Found'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Overall Status */}
                <div className={`p-4 sm:p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex-1">
                            <h2 className={`text-lg sm:text-xl font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                System Status
                            </h2>

                            {/* Status Message */}
                            <div className={`p-3 sm:p-4 rounded-lg lg:w-1/3 ${endpoints.filter(ep => ep.status === 'online').length === endpoints.length
                                ? theme === 'dark'
                                    ? 'bg-green-900/30 border border-green-700'
                                    : 'bg-green-50 border border-green-200'
                                : theme === 'dark'
                                    ? 'bg-red-900/30 border border-red-700'
                                    : 'bg-red-50 border border-red-200'
                                }`}>
                                {endpoints.filter(ep => ep.status === 'online').length === endpoints.length ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-green-400' : 'text-green-700'
                                                }`}>
                                                All Systems Working Fine
                                            </span>
                                        </div>
                                        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-600'
                                            }`}>
                                            All services are running normally and ready to use
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-red-400' : 'text-red-700'
                                                }`}>
                                                Some Services Not Working
                                            </span>
                                        </div>
                                        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'
                                            }`}>
                                            Please contact the relevant department to fix the issues
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 sm:mt-0">
                            <button
                                onClick={checkAllApis}
                                disabled={isChecking}
                                className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${isChecking
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white`}
                            >
                                {isChecking ? 'Checking...' : 'Check All'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Auto Refresh Controls */}
                <div className={`p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Auto Refresh
                            </span>
                        </label>
                        <select
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                            disabled={!autoRefresh}
                            className={`px-3 py-1 rounded border text-sm sm:text-base ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } ${!autoRefresh ? 'opacity-50' : ''}`}
                        >
                            <option value={10}>10 seconds</option>
                            <option value={30}>30 seconds</option>
                            <option value={60}>1 minute</option>
                            <option value={300}>5 minutes</option>
                        </select>
                    </div>
                </div>

                {/* API Endpoints Status */}
                <div className="grid gap-3 sm:gap-4">
                    {endpoints.map((endpoint, index) => (
                        <div
                            key={index}
                            className={`p-4 sm:p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}
                        >
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(endpoint.status)}`}></div>
                                        <h3 className={`text-base sm:text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {endpoint.name}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${endpoint.method === 'GET'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        {endpoint.requiresAuth && (
                                            <span className="px-2 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-800">
                                                AUTH
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 break-all`}>
                                        {endpoint.url}
                                    </p>
                                    
                                    {/* Show current payload/query params */}
                                    {(endpoint.testPayload || endpoint.queryParams) && (
                                        <div className={`mb-3 p-2 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {endpoint.testPayload ? 'Payload:' : 'Query Params:'}
                                            </span>
                                            <pre className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {JSON.stringify(endpoint.testPayload || endpoint.queryParams, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <div>
                                            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Status
                                            </span>
                                            <span className={`${endpoint.status === 'online' ? 'text-green-600' :
                                                endpoint.status === 'offline' ? 'text-red-600' :
                                                    endpoint.status === 'error' ? 'text-yellow-600' :
                                                        'text-blue-600'
                                                }`}>
                                                {getStatusText(endpoint.status)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Response Time
                                            </span>
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                                {formatResponseTime(endpoint.responseTime)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Status Code
                                            </span>
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                                {endpoint.statusCode || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Last Checked
                                            </span>
                                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                                {formatLastChecked(endpoint.lastChecked)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setEndpoints(prev => prev.map((ep, i) =>
                                            i === index
                                                ? { ...ep, status: 'checking' }
                                                : ep
                                        ))
                                        checkApiStatus(endpoint).then(updated => {
                                            setEndpoints(prev => prev.map((ep, i) =>
                                                i === index ? updated : ep
                                            ))
                                        })
                                    }}
                                    className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap ${theme === 'dark'
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Test
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Statistics */}
                <div className={`p-4 sm:p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                    <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Summary
                    </h3>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 text-sm flex-1">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-green-600">
                                    {endpoints.filter(ep => ep.status === 'online').length}
                                </div>
                                <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Online
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-red-600">
                                    {endpoints.filter(ep => ep.status === 'offline').length}
                                </div>
                                <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Offline
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                                    {endpoints.filter(ep => ep.status === 'error').length}
                                </div>
                                <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Errors
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApiStatus