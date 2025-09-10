/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
    getProjectDetails,
    getAccessibleLocations,
    getUserDetailsFromToken,
    ProjectDetailReportItem,
    ProjectDetailReportFilters,
    AccessibleLocations
} from '@/services/projectDetailReportService';

interface UserDetails {
    username: string;
    roleName: string;
    locationCode: string;
}

interface UseProjectDataResult {
    reportData: ProjectDetailReportItem[];
    accessibleLocations: AccessibleLocations | null;
    userDetails: UserDetails | null;
    loading: boolean;
    error: string | null;
    filters: ProjectDetailReportFilters;
    handleFilterChange: (newFilters: ProjectDetailReportFilters) => Promise<void>;
    updateFilter: (key: string, value: string) => void; // Changed to accept string keys
}

export const useProjectData = (initialFilters: ProjectDetailReportFilters = {}): UseProjectDataResult => {
    const [reportData, setReportData] = useState<ProjectDetailReportItem[]>([]);
    const [accessibleLocations, setAccessibleLocations] = useState<AccessibleLocations | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ProjectDetailReportFilters>(initialFilters);

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

                // Load initial project details
                const data = await getProjectDetails(initialFilters);
                setReportData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error loading project data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

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

    const updateFilter = (key: string, value: string) => {
        const newFilters = { ...filters };

        if (value === '') {
            delete newFilters[key as keyof ProjectDetailReportFilters];
        } else {
            if (key === 'mainProgram') {
                if (value === 'NP' || value === 'ADB' || value === 'WB') {
                    newFilters[key as keyof ProjectDetailReportFilters] = value as any;
                }
            } else {
                newFilters[key as keyof ProjectDetailReportFilters] = value as any;
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

    return {
        reportData,
        accessibleLocations,
        userDetails,
        loading,
        error,
        filters,
        handleFilterChange,
        updateFilter
    };
};