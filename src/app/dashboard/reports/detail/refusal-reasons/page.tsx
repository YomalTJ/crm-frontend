// page.tsx - Updated to apply default location filters
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import {
    getRefusalReasons,
    getAccessibleLocations,
    getUserDetailsFromToken,
    getUserDefaultLocation, // Add this import
    RefusalReasonItem,
    RefusalReasonFilters,
    AccessibleLocations
} from '@/services/refusalReasonsService';
import { useTheme } from '@/context/ThemeContext';
import ExportButton from '@/components/form-fields/ExportButton';
import LocationDropdowns from '@/components/form-fields/LocationDropdowns';
import RefusalReasonsTable from '@/components/form-fields/RefusalReasonsTable';

const RefusalReasons = () => {
    const { theme } = useTheme();

    const [reportData, setReportData] = useState<RefusalReasonItem[]>([]);
    const [accessibleLocations, setAccessibleLocations] = useState<AccessibleLocations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    interface UserDetails {
        username: string;
        roleName: string;
        locationCode: string;
    }

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [filters, setFilters] = useState<RefusalReasonFilters>({});
    const [searchTerm, setSearchTerm] = useState('');

    // Theme-aware color classes
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBgColor = () => theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getInputBorderColor = () => theme === 'dark' ? 'border-gray-400' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const getInputBgColor = () => theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

    // Load initial data on component mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user details from token
                const user = await getUserDetailsFromToken();
                setUserDetails(user);

                // Get accessible locations based on user's role and location
                const locations = await getAccessibleLocations();
                setAccessibleLocations(locations);

                // Get user's default location based on their access permissions
                const defaultLocationFilters = await getUserDefaultLocation();

                // Set the default location filters
                setFilters(defaultLocationFilters);

                // Load refusal reasons with default location filters
                const data = await getRefusalReasons(defaultLocationFilters);
                setReportData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading refusal reasons report:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Handle filter changes
    const handleFilterChange = async (newFilters: RefusalReasonFilters) => {
        try {
            setLoading(true);
            setFilters(newFilters);
            const data = await getRefusalReasons(newFilters);
            setReportData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    // Change the updateFilter function signature to accept string keys
    const updateFilter = (key: string, value: string) => {
        const newFilters = { ...filters };

        if (value === '') {
            delete newFilters[key as keyof RefusalReasonFilters];
        } else {
            if (key === 'mainProgram') {
                if (value === 'NP' || value === 'ADB' || value === 'WB') {
                    newFilters[key as keyof RefusalReasonFilters] = value as any;
                }
            } else {
                newFilters[key as keyof RefusalReasonFilters] = value as any;
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

        handleFilterChange(newFilters);
    };

    // Filter data based on search term
    const filteredData = reportData.filter(item =>
        item.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Export data to CSV
    const exportToCSV = () => {
        setIsExporting(true);

        try {
            // Define CSV headers
            const headers = [
                'Beneficiary Name',
                'NIC',
                'Mobile Phone',
                'Address',
                'Main Program',
                'District',
                'DS Division',
                'Zone',
                'GND',
                'Refusal Reason (English)',
                'Refusal Reason (Sinhala)',
                'Refusal Reason (Tamil)',
                'Created Date'
            ];

            // Convert data to CSV format
            const csvContent = [
                headers.join(','),
                ...filteredData.map(item => [
                    `"${item.beneficiaryName}"`,
                    `"${item.nic}"`,
                    `"${item.mobilePhone}"`,
                    `"${item.address.replace(/"/g, '""')}"`,
                    `"${item.mainProgram}"`,
                    `"${item.location.district?.district_name || ''}"`,
                    `"${item.location.ds?.ds_name || ''}"`,
                    `"${item.location.zone?.zone_name || ''}"`,
                    `"${item.location.gnd?.gnd_name || ''}"`,
                    `"${item.refusalReason.reason_en.replace(/"/g, '""')}"`,
                    `"${item.refusalReason.reason_si.replace(/"/g, '""')}"`,
                    `"${item.refusalReason.reason_ta.replace(/"/g, '""')}"`,
                    `"${new Date(item.createdAt).toLocaleDateString('en-US')}"`
                ].join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);

                // Generate filename with timestamp
                const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                const filterSuffix = Object.keys(filters).length > 0 || searchTerm ? '_filtered' : '_all';
                link.setAttribute('download', `refusal_reasons_report${filterSuffix}_${timestamp}.csv`);

                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Cleanup
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            setError('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${getBgColor()}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className={`ml-3 text-lg ${getTextColor()}`}>Loading refusal reasons data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${getBgColor()}`}>
                <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>Error Loading Report</h3>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-4 px-4 py-2 rounded-md text-sm transition-colors ${theme === 'dark'
                            ? 'bg-red-700 text-white hover:bg-red-600'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className={`rounded-lg shadow-sm p-6 mb-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h1 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>Empowerment Refusal Reasons</h1>

                        {/* User Info */}
                        {userDetails && (
                            <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p><span className="font-medium">User:</span> {userDetails.username} ({userDetails.roleName})</p>
                                <p><span className="font-medium">Location Code:</span> {userDetails.locationCode}</p>
                            </div>
                        )}
                    </div>

                    <ExportButton
                        onClick={exportToCSV}
                        isExporting={isExporting}
                        count={filteredData.length}
                        disabled={isExporting || filteredData.length === 0}
                    />
                </div>

                {/* Location Filter Cards */}
                {accessibleLocations && (
                    <LocationDropdowns
                        accessibleLocations={accessibleLocations}
                        filters={filters}
                        updateFilter={updateFilter}
                    />
                )}

                {/* Search and Program Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by beneficiary name, NIC, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                        />
                    </div>
                    <select
                        value={filters.mainProgram || ''}
                        onChange={(e) => updateFilter('mainProgram', e.target.value)}
                        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                    >
                        <option value="">All Programs</option>
                        <option value="NP">National Program</option>
                        <option value="ADB">ADB Program</option>
                        <option value="WB">World Bank pilot program</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <RefusalReasonsTable
                data={filteredData}
                totalCount={reportData.length}
            />
        </div>
    );
};

export default RefusalReasons;