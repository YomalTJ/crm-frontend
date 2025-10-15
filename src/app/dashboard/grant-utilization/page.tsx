'use client'

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useProjectData } from '@/hooks/useProjectData';
import PageHeader from '@/components/layout/PageHeader';
import ProjectDataTable from '@/components/form-fields/ProjectDataTable';
import StatsCards from '@/components/form-fields/StatsCards';
import ProjectFilters from '@/components/filters/ProjectFilters';

const GrantUtilization = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const {
        reportData,
        accessibleLocations,
        userDetails,
        loading,
        error,
        filters,
        updateFilter
    } = useProjectData();

    // Theme-aware color classes
    const getBgColor = () => theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const getTextColor = () => theme === 'dark' ? 'text-gray-100' : 'text-gray-900';

    // Filter data based on search term and consent
    const filteredData = reportData
        .filter(item => item.hasConsentedToEmpowerment === 1)
        .filter(item =>
            item.family_beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.family_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Handle create grant utilization button click
    const handleCreateGrantUtilization = (familyId: string) => {
        router.push(`/dashboard/grant-utilization/create/${familyId}`);
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
                            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>Error Loading Data</h3>
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
            {/* Header with Filters */}
            <PageHeader
                title="View All Beneficiaries for Grant Utilization"
                userDetails={userDetails}
            >
                <ProjectFilters
                    accessibleLocations={accessibleLocations}
                    filters={filters}
                    updateFilter={updateFilter}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </PageHeader>

            {/* Statistics */}
            <StatsCards
                total={filteredData.length}
                npCount={filteredData.filter(item => item.family_mainProgram === 'NP').length}
                adbCount={filteredData.filter(item => item.family_mainProgram === 'ADB').length}
                wbCount={filteredData.filter(item => item.family_mainProgram === 'WB').length}
            />

            {/* Data Table with Action Column */}
            <ProjectDataTable
                data={filteredData.map(item => ({
                    ...item,
                    action: (
                        <button
                            onClick={() => handleCreateGrantUtilization(item.hh_number || item.nic)}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${theme === 'dark'
                                ? 'bg-blue-600 text-white hover:bg-blue-500'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            Create
                        </button>
                    )
                }))}
                totalCount={reportData.length}
                showActionColumn={true}
            />
        </div>
    );
};

export default GrantUtilization;