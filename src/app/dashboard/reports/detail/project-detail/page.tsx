'use client'

import React, { useState, useEffect } from 'react';
import {
    getProjectDetails,
    getAccessibleLocations,
    getUserDetailsFromToken,
    ProjectDetailReportItem,
    ProjectDetailReportFilters,
    AccessibleLocations
} from '@/services/projectDetailReportService';
import { useTheme } from '@/context/ThemeContext';

const ProjectDetailReport = () => {
    const { theme } = useTheme();

    const [reportData, setReportData] = useState<ProjectDetailReportItem[]>([]);
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
    const [filters, setFilters] = useState<ProjectDetailReportFilters>({});
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
                console.log("locations: ", locations);
                setAccessibleLocations(locations);

                // Load initial project details without filters (will be filtered by user's role on backend)
                const data = await getProjectDetails();
                setReportData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading project detail report:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Handle filter changes
    const handleFilterChange = async (newFilters: ProjectDetailReportFilters) => {
        try {
            setLoading(true);
            setFilters(newFilters);
            const data = await getProjectDetails(newFilters);
            setReportData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    // Handle individual filter updates
    const updateFilter = (key: keyof ProjectDetailReportFilters, value: string) => {
        const newFilters = { ...filters };

        if (value === '') {
            delete newFilters[key];
        } else {
            if (key === 'mainProgram') {
                if (value === 'NP' || value === 'ADB' || value === 'WB') {
                    newFilters[key] = value;
                }
            } else {
                newFilters[key] = value;
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
        item.family_beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.family_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Export data to CSV
    const exportToCSV = () => {
        setIsExporting(true);

        try {
            // Define CSV headers
            const headers = [
                'Family ID',
                'Beneficiary Name',
                'Gender',
                'Category',
                'Address',
                'Main Program',
                'District',
                'DS Division',
                'Zone',
                'GND'
            ];

            // Convert data to CSV format
            const csvContent = [
                headers.join(','),
                ...filteredData.map(item => [
                    `"${item.family_id}"`,
                    `"${item.family_beneficiaryName}"`,
                    `"${item.family_beneficiaryGender}"`,
                    `"${item.category}"`,
                    `"${item.family_address.replace(/"/g, '""')}"`, // Escape quotes in address
                    `"${item.family_mainProgram}"`,
                    `"${item.district_name}"`,
                    `"${item.ds_name}"`,
                    `"${item.zone_name}"`,
                    `"${item.gnd_name}"`
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
                link.setAttribute('download', `project_detail_report${filterSuffix}_${timestamp}.csv`);

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

    // Get program badge color (now theme-aware)
    const getProgramBadgeColor = (program: string) => {
        const baseColors = {
            NP: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-100' },
            ADB: { light: 'bg-green-100 text-green-800', dark: 'bg-green-900 text-green-100' },
            WB: { light: 'bg-purple-100 text-purple-800', dark: 'bg-purple-900 text-purple-100' },
            default: { light: 'bg-gray-100 text-gray-800', dark: 'bg-gray-700 text-gray-100' }
        };

        const colorSet =
            program === 'NP' ? baseColors.NP :
                program === 'ADB' ? baseColors.ADB :
                    program === 'WB' ? baseColors.WB :
                        baseColors.default;

        return theme === 'dark' ? colorSet.dark : colorSet.light;
    };

    // Get filtered locations based on selected filters - FIXED VERSION
    const getFilteredLocations = () => {
        if (!accessibleLocations) return { districts: [], dss: [], zones: [], gnds: [] };

        let availableDS = accessibleLocations.dss;
        let availableZones = accessibleLocations.zones;
        let availableGNDs = accessibleLocations.gndDivisions;

        // Filter DS divisions based on selected district
        if (filters.district_id) {
            const selectedDistrictId = filters.district_id; // Keep as string since backend expects string
            availableDS = accessibleLocations.dss.filter(ds =>
                ds.district_id === selectedDistrictId
            );
        }

        // Filter zones based on selected DS
        if (filters.ds_id) {
            const selectedDsId = filters.ds_id; // Keep as string since backend expects string
            availableZones = accessibleLocations.zones.filter(zone =>
                zone.ds_id === selectedDsId
            );
        }

        // Filter GNDs based on selected zone
        if (filters.zone_id) {
            const selectedZoneId = filters.zone_id; // Keep as string since backend expects string
            availableGNDs = accessibleLocations.gndDivisions.filter(gnd =>
                gnd.zone_id === selectedZoneId
            );
        }

        return {
            districts: accessibleLocations.districts,
            dss: availableDS,
            zones: availableZones,
            gnds: availableGNDs
        };
    };

    const filteredLocations = getFilteredLocations();

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${getBgColor()}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className={`ml-3 text-lg ${getTextColor()}`}>Loading report data...</span>
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
                        <h1 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>Project Detail Report</h1>

                        {/* User Info */}
                        {userDetails && (
                            <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p><span className="font-medium">User:</span> {userDetails.username} ({userDetails.roleName})</p>
                                <p><span className="font-medium">Location Code:</span> {userDetails.locationCode}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={exportToCSV}
                        disabled={isExporting || filteredData.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isExporting || filteredData.length === 0
                            ? theme === 'dark'
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : theme === 'dark'
                                ? 'bg-green-700 hover:bg-green-600 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isExporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export CSV ({filteredData.length} records)
                            </>
                        )}
                    </button>
                </div>

                {/* Location Filter Cards */}
                {accessibleLocations && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* District Selection */}
                        {filteredLocations.districts.length > 0 && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-blue-200' : 'text-gray-500'}`}>District</p>
                                {filteredLocations.districts.length === 1 ? (
                                    <p className={`font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                                        {filteredLocations.districts[0].district_name}
                                    </p>
                                ) : (
                                    <select
                                        value={filters.district_id || ''}
                                        onChange={(e) => updateFilter('district_id', e.target.value)}
                                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-blue-800 text-blue-100' : 'bg-white text-blue-900'}`}
                                    >
                                        <option value="">All Districts</option>
                                        {filteredLocations.districts.map((district) => (
                                            <option key={district.district_id} value={district.district_id.toString()}>
                                                {district.district_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* DS Division Selection */}
                        {filteredLocations.dss.length > 0 && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-green-200' : 'text-gray-500'}`}>DS Division</p>
                                {filteredLocations.dss.length === 1 ? (
                                    <p className={`font-medium ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                                        {filteredLocations.dss[0].ds_name}
                                    </p>
                                ) : (
                                    <select
                                        value={filters.ds_id || ''}
                                        onChange={(e) => updateFilter('ds_id', e.target.value)}
                                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-green-500 ${theme === 'dark' ? 'bg-green-800 text-green-100' : 'bg-white text-green-900'}`}
                                    >
                                        <option value="">All DS Divisions</option>
                                        {filteredLocations.dss.map((ds) => (
                                            <option key={ds.ds_id} value={ds.ds_id.toString()}>
                                                {ds.ds_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* Zone Selection */}
                        {filteredLocations.zones.length > 0 && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-50'}`}>
                                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-purple-200' : 'text-gray-500'}`}>Zone</p>
                                {filteredLocations.zones.length === 1 ? (
                                    <p className={`font-medium ${theme === 'dark' ? 'text-purple-100' : 'text-purple-900'}`}>
                                        {filteredLocations.zones[0].zone_name}
                                    </p>
                                ) : (
                                    <select
                                        value={filters.zone_id || ''}
                                        onChange={(e) => updateFilter('zone_id', e.target.value)}
                                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-purple-500 ${theme === 'dark' ? 'bg-purple-800 text-purple-100' : 'bg-white text-purple-900'}`}
                                    >
                                        <option value="">All Zones</option>
                                        {filteredLocations.zones.map((zone) => (
                                            <option key={zone.zone_id} value={zone.zone_id.toString()}>
                                                {zone.zone_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* GND Selection */}
                        {filteredLocations.gnds.length > 0 && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900' : 'bg-orange-50'}`}>
                                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-orange-200' : 'text-gray-500'}`}>GND</p>
                                {filteredLocations.gnds.length === 1 ? (
                                    <p className={`font-medium ${theme === 'dark' ? 'text-orange-100' : 'text-orange-900'}`}>
                                        {filteredLocations.gnds[0].gnd_name}
                                    </p>
                                ) : (
                                    <select
                                        value={filters.gnd_id || ''}
                                        onChange={(e) => updateFilter('gnd_id', e.target.value)}
                                        className={`w-full text-sm border-0 rounded focus:ring-1 focus:ring-orange-500 ${theme === 'dark' ? 'bg-orange-800 text-orange-100' : 'bg-white text-orange-900'}`}
                                    >
                                        <option value="">All GNDs</option>
                                        {filteredLocations.gnds.map((gnd) => (
                                            <option key={gnd.gnd_id} value={gnd.gnd_id}>
                                                {gnd.gnd_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Search and Program Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by beneficiary name, address, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                        />
                    </div>
                    <select
                        value={filters.mainProgram || ''}
                        onChange={(e) => updateFilter('mainProgram', e.target.value as 'NP' | 'ADB' | 'WB' | '')}
                        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                    >
                        <option value="">All Programs</option>
                        <option value="NP">National Program</option>
                        <option value="ADB">ADB Program</option>
                        <option value="WB">World Bank Program</option>
                    </select>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                    <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>Total Beneficiaries</h3>
                    <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{filteredData.length}</p>
                </div>
                <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                    <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>NP Program</h3>
                    <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{filteredData.filter(item => item.family_mainProgram === 'NP').length}</p>
                </div>
                <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                    <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>ADB Program</h3>
                    <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{filteredData.filter(item => item.family_mainProgram === 'ADB').length}</p>
                </div>
                <div className={`rounded-lg shadow-sm p-6 ${getCardBgColor()} ${getBorderColor()} border`}>
                    <h3 className={`text-lg font-medium mb-2 ${getTextColor()}`}>WB Program</h3>
                    <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{filteredData.filter(item => item.family_mainProgram === 'WB').length}</p>
                </div>
            </div>

            {/* Data Table */}
            <div className={`rounded-lg shadow-sm overflow-hidden ${getCardBgColor()} ${getBorderColor()} border`}>
                <div className={`px-6 py-4 border-b ${getBorderColor()}`}>
                    <h2 className={`text-lg font-medium ${getTextColor()}`}>Beneficiary Details</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Showing {filteredData.length} of {reportData.length} beneficiaries
                    </p>
                </div>

                {filteredData.length === 0 ? (
                    <div className={`text-center py-12 ${getTextColor()}`}>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium">No beneficiaries found</h3>
                        <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Beneficiary Name
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Program
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Gender
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Category
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Address
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {filteredData.map((item) => (
                                    <tr
                                        key={item.family_id}
                                        className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {item.family_beneficiaryName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgramBadgeColor(item.family_mainProgram)}`}>
                                                {item.family_mainProgram}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            {item.family_beneficiaryGender}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`} title={item.family_address}>
                                                {item.family_address}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailReport;