/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import {
    getFamilyDemographics,
    getBeneficiaryTypes,
    getAccessibleLocations,
    getUserDetailsFromToken,
    FamilyDemographicsItem,
    FamilyDemographicsFilters,
    AccessibleLocations,
    BeneficiaryType
} from '@/services/familyDemographicsService';
import { useTheme } from '@/context/ThemeContext';
import ExportButton from '@/components/form-fields/ExportButton';
import LocationDropdowns from '@/components/form-fields/LocationDropdowns';
import AgeRangeSelector from '@/components/form-fields/AgeRangeSelector';
import FamilyDemographicsStatsCards from '@/components/form-fields/FamilyDemographicsStatsCards';
import FamilyDemographicsTable from '@/components/form-fields/FamilyDemographicsTable';

const FamilyAgeGroups = () => {
    const { theme } = useTheme();

    const [reportData, setReportData] = useState<FamilyDemographicsItem[]>([]);
    const [accessibleLocations, setAccessibleLocations] = useState<AccessibleLocations | null>(null);
    const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedAgeRange, setSelectedAgeRange] = useState<'below16' | '16To24' | '25To45' | '46To60' | 'above60'>('16To24');

    interface UserDetails {
        username: string;
        roleName: string;
        locationCode: string;
    }

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [filters, setFilters] = useState<FamilyDemographicsFilters>({});
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

                // Get beneficiary types
                const types = await getBeneficiaryTypes();
                console.log("beneficiary types: ", types);
                setBeneficiaryTypes(types);

                // Load initial family demographics for 16-24 age range
                const initialFilters = { minAge: 16, maxAge: 24 };
                const data = await getFamilyDemographics(initialFilters);
                setReportData(data);
                setFilters(initialFilters);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading family demographics report:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Handle age range change
    const handleAgeRangeChange = async (range: 'below16' | '16To24' | '25To45' | '46To60' | 'above60') => {
        setSelectedAgeRange(range);

        let ageFilters: { minAge?: number; maxAge?: number } = {};

        switch (range) {
            case 'below16':
                ageFilters = { maxAge: 15 };
                break;
            case '16To24':
                ageFilters = { minAge: 16, maxAge: 24 };
                break;
            case '25To45':
                ageFilters = { minAge: 25, maxAge: 45 };
                break;
            case '46To60':
                ageFilters = { minAge: 46, maxAge: 60 };
                break;
            case 'above60':
                ageFilters = { minAge: 61 };
                break;
        }

        const newFilters = { ...filters, ...ageFilters };
        await handleFilterChange(newFilters);
    };

    // Handle filter changes
    const handleFilterChange = async (newFilters: FamilyDemographicsFilters) => {
        try {
            setLoading(true);
            setFilters(newFilters);
            const data = await getFamilyDemographics(newFilters);
            setReportData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    // Handle individual filter updates
    const updateFilter = (key: keyof FamilyDemographicsFilters, value: string) => {
        const newFilters = { ...filters };

        if (value === '') {
            delete newFilters[key];
        } else {
            if (key === 'mainProgram') {
                if (value === 'NP' || value === 'ADB' || value === 'WB') {
                    newFilters[key] = value as FamilyDemographicsFilters[typeof key];
                }
            } else {
                newFilters[key] = value as any;
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
        item.projectOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ds.ds_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.zone.zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gnd.gnd_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.beneficiaryType?.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Export data to CSV
    const exportToCSV = () => {
        setIsExporting(true);

        try {
            const getAgeRangeLabel = (range: string) => {
                const labels = {
                    'below16': 'Below 16',
                    '16To24': '16-24',
                    '25To45': '25-45',
                    '46To60': '46-60',
                    'above60': '60+'
                };
                return labels[range as keyof typeof labels];
            };

            // Define CSV headers
            const headers = [
                'Project Owner Name',
                'Main Program',
                'District',
                'DS Division',
                'Zone',
                'GND',
                'Total Family Members',
                'Total Male',
                'Total Female',
                `${getAgeRangeLabel(selectedAgeRange)} - Total`,
                `${getAgeRangeLabel(selectedAgeRange)} - Male`,
                `${getAgeRangeLabel(selectedAgeRange)} - Female`,
                'Beneficiary Type (English)',
                'Beneficiary Type (Sinhala)',
                'Beneficiary Type (Tamil)'
            ];

            // Convert data to CSV format
            const csvContent = [
                headers.join(','),
                ...filteredData.map(item => {
                    const ageRangeKeyMap: Record<typeof selectedAgeRange, keyof typeof item.demographics.ageRanges> = {
                        below16: 'below16',
                        '16To24': 'age16To24',
                        '25To45': 'age25To45',
                        '46To60': 'age46To60',
                        above60: 'above60'
                    };
                    const ageRangeData = item.demographics.ageRanges[ageRangeKeyMap[selectedAgeRange]];
                    return [
                        `"${item.projectOwnerName}"`,
                        `"${item.mainProgram}"`,
                        `"${item.district.district_name}"`,
                        `"${item.ds.ds_name}"`,
                        `"${item.zone.zone_name}"`,
                        `"${item.gnd.gnd_name}"`,
                        `"${item.demographics.totalFamilyMembers}"`,
                        `"${item.demographics.totalMale}"`,
                        `"${item.demographics.totalFemale}"`,
                        `"${ageRangeData.total}"`,
                        `"${ageRangeData.male}"`,
                        `"${ageRangeData.female}"`,
                        `"${item.beneficiaryType?.nameEnglish || 'N/A'}"`,
                        `"${item.beneficiaryType?.nameSinhala || 'N/A'}"`,
                        `"${item.beneficiaryType?.nameTamil || 'N/A'}"`
                    ].join(',');
                })
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
                const ageRangeLabel = selectedAgeRange.replace(/To/, '-');
                link.setAttribute('download', `family_demographics_${ageRangeLabel}${filterSuffix}_${timestamp}.csv`);

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
                        <h1 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>Family Age Groups Report</h1>

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

                {/* Age Range Selector */}
                <AgeRangeSelector
                    selectedRange={selectedAgeRange}
                    onRangeChange={handleAgeRangeChange}
                />

                {/* Location Filter Cards */}
                {accessibleLocations && (
                    <LocationDropdowns
                        accessibleLocations={accessibleLocations}
                        filters={filters}
                        updateFilter={updateFilter}
                    />
                )}

                {/* Search, Program Filter, and Beneficiary Type Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by owner name, location, or beneficiary type..."
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
                        <option value="WB">World Bank pilot program</option>
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

            {/* Statistics */}
            <FamilyDemographicsStatsCards
                data={filteredData}
                selectedAgeRange={selectedAgeRange}
            />

            {/* Data Table */}
            <FamilyDemographicsTable
                data={filteredData}
                totalCount={reportData.length}
                selectedAgeRange={selectedAgeRange}
            />
        </div>
    );
};

export default FamilyAgeGroups;