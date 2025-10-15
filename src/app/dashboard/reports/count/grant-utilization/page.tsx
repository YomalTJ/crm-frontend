/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ExportButton from '@/components/form-fields/ExportButton';
import LocationDropdowns from '@/components/form-fields/LocationDropdowns';
import GrantUtilizationTable from '@/components/form-fields/GrantUtilizationTable';
import { getUserDefaultLocation } from '@/services/areaTypesService';
import { BeneficiaryType, GrantUtilizationData, GrantUtilizationFilters, getBeneficiaryTypes, getGrantUtilization } from '@/services/grantUtilizationReportsService';
import { AccessibleLocations, getUserDetailsFromToken, getAccessibleLocations } from '@/services/projectDetailReportService';

const GrantUtilizationReport = () => {
    const { theme } = useTheme();

    const [reportData, setReportData] = useState<GrantUtilizationData | null>(null);
    const [accessibleLocations, setAccessibleLocations] = useState<AccessibleLocations | null>(null);
    const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    interface UserDetails {
        username: string;
        roleName: string;
        locationCode: string;
    }

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [filters, setFilters] = useState<GrantUtilizationFilters>({});

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

                const types = await getBeneficiaryTypes();
                setBeneficiaryTypes(types);

                // Get user's default location filters
                const defaultFilters = await getUserDefaultLocation();

                // Set the initial filters to user's default location
                setFilters(defaultFilters);

                // Load grant utilization with user's default location filters
                const data = await getGrantUtilization(defaultFilters);
                setReportData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading grant utilization report:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Handle filter changes
    const handleFilterChange = async (newFilters: GrantUtilizationFilters) => {
        try {
            setLoading(true);
            setFilters(newFilters);
            const data = await getGrantUtilization(newFilters);
            setReportData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    // Handle individual filter updates
    const updateFilter = (key: string, value: string) => {
        const newFilters = { ...filters };

        if (value === '') {
            delete newFilters[key as keyof GrantUtilizationFilters];
        } else {
            if (key === 'mainProgram') {
                if (value === 'NP' || value === 'ADB' || value === 'WB') {
                    newFilters[key as keyof GrantUtilizationFilters] = value as any;
                }
            } else {
                newFilters[key as keyof GrantUtilizationFilters] = value as any;
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

    // Export data to CSV
    const exportToCSV = () => {
        if (!reportData) return;

        setIsExporting(true);

        try {
            // Define CSV headers
            const headers = [
                'District',
                'DS Division',
                'Zone',
                'GND',
                'Grant Type',
                'Total Projects',
                'Total Amount (LKR)'
            ];

            // Create CSV data array
            const csvData = [
                {
                    district: reportData.location?.district?.district_name || 'All Districts',
                    ds: reportData.location?.ds?.ds_name || 'All DS',
                    zone: reportData.location?.zone?.zone_name || 'All Zones',
                    gnd: reportData.location?.gnd?.gnd_name || 'All GNDs',
                    grantType: 'Financial Aid',
                    totalProjects: reportData.financialAid.totalProjects,
                    totalAmount: reportData.financialAid.totalAmount
                },
                {
                    district: reportData.location?.district?.district_name || 'All Districts',
                    ds: reportData.location?.ds?.ds_name || 'All DS',
                    zone: reportData.location?.zone?.zone_name || 'All Zones',
                    gnd: reportData.location?.gnd?.gnd_name || 'All GNDs',
                    grantType: 'Interest Subsidized Loan',
                    totalProjects: reportData.interestSubsidizedLoan.totalProjects,
                    totalAmount: reportData.interestSubsidizedLoan.totalAmount
                },
                {
                    district: reportData.location?.district?.district_name || 'All Districts',
                    ds: reportData.location?.ds?.ds_name || 'All DS',
                    zone: reportData.location?.zone?.zone_name || 'All Zones',
                    gnd: reportData.location?.gnd?.gnd_name || 'All GNDs',
                    grantType: 'Samurdhi Bank Loan',
                    totalProjects: reportData.samurdiBankLoan.totalProjects,
                    totalAmount: reportData.samurdiBankLoan.totalAmount
                },
                {
                    district: reportData.location?.district?.district_name || 'All Districts',
                    ds: reportData.location?.ds?.ds_name || 'All DS',
                    zone: reportData.location?.zone?.zone_name || 'All Zones',
                    gnd: reportData.location?.gnd?.gnd_name || 'All GNDs',
                    grantType: 'Overall Total',
                    totalProjects: reportData.overallTotal.totalProjects,
                    totalAmount: reportData.overallTotal.totalAmount
                }
            ];

            // Convert data to CSV format
            const csvContent = [
                headers.join(','),
                ...csvData.map(item => [
                    `"${item.district}"`,
                    `"${item.ds}"`,
                    `"${item.zone}"`,
                    `"${item.gnd}"`,
                    `"${item.grantType}"`,
                    `"${item.totalProjects}"`,
                    `"${item.totalAmount}"`
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
                const filterSuffix = Object.keys(filters).length > 0 ? '_filtered' : '_all';
                link.setAttribute('download', `grant_utilization_report${filterSuffix}_${timestamp}.csv`);

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
                <span className={`ml-3 text-lg ${getTextColor()}`}>Loading grant utilization data...</span>
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

    const hasData = reportData && reportData.overallTotal.totalProjects > 0;

    return (
        <div>
            {/* Header */}
            <div className={`rounded-lg shadow-sm p-6 mb-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h1 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>Grant Utilization Report</h1>

                        {/* User Info */}
                        {userDetails && (
                            <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p><span className="font-medium">User:</span> {userDetails.username} ({userDetails.roleName})</p>
                                <p><span className="font-medium">Location Code:</span> {userDetails.locationCode}</p>
                            </div>
                        )}

                        {/* Summary Statistics */}
                        {reportData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>Total Projects</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                                        {new Intl.NumberFormat('en-LK').format(reportData.overallTotal.totalProjects)}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-600'}`}>Total Amount</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                                        {new Intl.NumberFormat('en-LK', {
                                            style: 'currency',
                                            currency: 'LKR',
                                            notation: 'compact',
                                            maximumFractionDigits: 1
                                        }).format(reportData.overallTotal.totalAmount)}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-50'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}`}>Financial Aid</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-100' : 'text-purple-900'}`}>
                                        {new Intl.NumberFormat('en-LK').format(reportData.financialAid.totalProjects)} projects
                                    </p>
                                </div>

                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>Interest Subsidized Loans</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                                        {new Intl.NumberFormat('en-LK').format(reportData.interestSubsidizedLoan.totalProjects)} projects
                                    </p>
                                </div>

                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900' : 'bg-orange-50'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-orange-600'}`}>Samurdhi Bank Loans</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-orange-100' : 'text-orange-900'}`}>
                                        {new Intl.NumberFormat('en-LK').format(reportData.samurdiBankLoan.totalProjects)} projects
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <ExportButton
                        onClick={exportToCSV}
                        isExporting={isExporting}
                        count={hasData ? 4 : 0} // 4 rows (3 grant types + total)
                        disabled={isExporting || !hasData}
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

                {/* Program and Beneficiary Type Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <select
                        value={filters.mainProgram || ''}
                        onChange={(e) => updateFilter('mainProgram', e.target.value)}
                        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                    >
                        <option value="">All Programs</option>
                        <option value="NP">National Program</option>
                        <option value="ADB">ADB Program</option>
                        <option value="WB">World Bank Program</option>
                    </select>

                    <select
                        value={filters.beneficiary_type_id || ''}
                        onChange={(e) => updateFilter('beneficiary_type_id', e.target.value)}
                        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                    >
                        <option value="">All Beneficiary Types</option>
                        {beneficiaryTypes.map((type) => (
                            <option key={type.beneficiary_type_id} value={type.beneficiary_type_id}>
                                {type.nameEnglish}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <GrantUtilizationTable data={reportData} />
        </div>
    );
};

export default GrantUtilizationReport;