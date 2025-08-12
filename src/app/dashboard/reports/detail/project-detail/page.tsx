'use client'

import React, { useState, useEffect } from 'react';
import {
    getProjectDetailReport,
    getUserDetailsFromToken,
    ProjectDetailReportItem,
    ProjectDetailReportFilters,
    UserLocationDetails
} from '@/services/projectDetailReportService';
import { useTheme } from '@/context/ThemeContext';
import { getUserLocationDetails } from '@/utils/userLocation';

const ProjectDetailReport = () => {
    const { theme } = useTheme();

    const [reportData, setReportData] = useState<ProjectDetailReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    interface UserDetails {
        username: string;
        roleName: string;
        locationCode: string;
    }

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [locationDetails, setLocationDetails] = useState<UserLocationDetails | null>(null);
    const [filters, setFilters] = useState<ProjectDetailReportFilters>({});
    const [searchTerm, setSearchTerm] = useState('');

    // Theme-aware color classes
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const getBgColor = () => theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const getBorderColor = () => theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const getInputBorderColor = () => theme === 'dark' ? 'border-gray-400' : 'border-gray-200';
    const getCardBgColor = () => theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const getInputBgColor = () => theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user details from token
                const user = getUserDetailsFromToken();
                setUserDetails(await user);

                // Get location details
                const location = getUserLocationDetails();
                setLocationDetails(location);

                // Set filters based on location
                const locationFilters: ProjectDetailReportFilters = {};
                if (location?.district?.id) locationFilters.district_id = String(location.district.id);
                if (location?.dsDivision?.id) locationFilters.ds_id = String(location.dsDivision.id);
                if (location?.zone?.id) locationFilters.zone_id = String(location.zone.id);
                if (location?.gnd?.id) locationFilters.gnd_id = location.gnd.id;

                // Fetch report data
                const data = await getProjectDetailReport(filters);
                setReportData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading project detail report:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Handle filter changes
    const handleFilterChange = async (newFilters: ProjectDetailReportFilters) => {
        try {
            setLoading(true);
            setFilters(newFilters);
            const data = await getProjectDetailReport(newFilters);
            setReportData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on search term
    const filteredData = reportData.filter(item =>
        item.family_beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.family_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <h1 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>Project Detail Report</h1>

                {/* User Info */}
                {userDetails && (
                    <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p><span className="font-medium">User:</span> {userDetails.username} ({userDetails.roleName})</p>
                        <p><span className="font-medium">Location Code:</span> {userDetails.locationCode}</p>
                    </div>
                )}

                {/* Location Details */}
                {locationDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {locationDetails.district && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-gray-500'}`}>District</p>
                                <p className={`font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>{locationDetails.district.name}</p>
                            </div>
                        )}
                        {locationDetails.dsDivision && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-gray-500'}`}>DS Division</p>
                                <p className={`font-medium ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>{locationDetails.dsDivision.name}</p>
                            </div>
                        )}
                        {locationDetails.zone && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-purple-200' : 'text-gray-500'}`}>Zone</p>
                                <p className={`font-medium ${theme === 'dark' ? 'text-purple-100' : 'text-purple-900'}`}>{locationDetails.zone.name}</p>
                            </div>
                        )}
                        {locationDetails.gnd && (
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900' : 'bg-orange-50'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-gray-500'}`}>GND</p>
                                <p className={`font-medium ${theme === 'dark' ? 'text-orange-100' : 'text-orange-900'}`}>{locationDetails.gnd.name}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by beneficiary name, address, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-4 py-2 border-wh rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border ${getInputBorderColor()
                                } ${getInputBgColor()}`}
                        />
                    </div>
                    <select
                        value={filters.mainProgram || ''}
                        onChange={(e) => handleFilterChange({ ...filters, mainProgram: e.target.value as 'NP' | 'ADB' | 'WB' | undefined })}
                        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()
                            } ${getInputBgColor()}`}
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
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        Beneficiary Name
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        Program
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        Gender
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        Category
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        Address
                                    </th>
                                    {/* <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        Location
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                                }`}>
                                {filteredData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {item.family_beneficiaryName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgramBadgeColor(item.family_mainProgram)
                                                }`}>
                                                {item.family_mainProgram}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                            }`}>
                                            {item.family_gender}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                            }`}>
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                                }`} title={item.family_address}>
                                                {item.family_address}
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                                }`}>
                                                <div>{item.districtName}</div>
                                                <div>{item.dsName}</div>
                                                <div>{item.zoneName}</div>
                                                <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'
                                                    }`}>{item.gndName}</div>
                                            </div>
                                        </td> */}
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