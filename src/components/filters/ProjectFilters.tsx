import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AccessibleLocations, ProjectDetailReportFilters } from '@/services/projectDetailReportService';
import LocationDropdowns from '@/components/form-fields/LocationDropdowns';

interface ProjectFiltersProps {
    accessibleLocations: AccessibleLocations | null;
    filters: ProjectDetailReportFilters;
    updateFilter: (key: string, value: string) => void; // Changed to accept string keys
    searchTerm: string;
    onSearchChange: (term: string) => void;
    showProgramFilter?: boolean;
    additionalFilters?: React.ReactNode;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
    accessibleLocations,
    filters,
    updateFilter,
    searchTerm,
    onSearchChange,
    showProgramFilter = true,
    additionalFilters
}) => {
    const { theme } = useTheme();

    const getInputBorderColor = () => theme === 'dark' ? 'border-gray-400' : 'border-gray-200';
    const getInputBgColor = () => theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

    return (
        <div className="space-y-4">
            {/* Location Filters */}
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
                        placeholder="Search by beneficiary name, address, or category..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getInputBorderColor()} ${getInputBgColor()}`}
                    />
                </div>

                {showProgramFilter && (
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
                )}

                {additionalFilters}
            </div>
        </div>
    );
};

export default ProjectFilters;