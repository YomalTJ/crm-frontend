/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { cookies } from 'next/headers';

// Area Types Response Interface
export interface AreaTypeItem {
    district?: {
        district_id: number;
        district_name: string;
    };
    ds?: {
        ds_id: number;
        ds_name: string;
    };
    zone?: {
        zone_id: number;
        zone_name: string;
    };
    gnd?: {
        gnd_id: string;
        gnd_name: string;
    };
    programs: ProgramAreaType[];
}

export interface ProgramAreaType {
    mainProgram: string;
    areaTypeCounts: {
        URBAN: number;
        RURAL: number;
        ESTATE: number;
        total: number;
    };
}

// Filter interface for area types
export interface AreaTypeFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    areaClassification?: 'URBAN' | 'RURAL' | 'ESTATE';
}

// AccessibleLocations interface (reused from project owners)
export interface AccessibleLocations {
    districts: {
        district_id: number;
        district_name: string;
        province_id?: string;
    }[];
    dss: {
        ds_id: number;
        ds_name: string;
        district_id?: string;
    }[];
    zones: {
        zone_id: number;
        zone_name: string;
        ds_id?: string;
    }[];
    gndDivisions: {
        gnd_id: string;
        gnd_name: string;
        zone_id?: string;
    }[];
}

// Decode JWT token to get user details
export const getUserDetailsFromToken = async () => {
    if (typeof window === 'undefined') return null;

    const staffToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('staffAccessToken='))
        ?.split('=')[1];

    if (staffToken) {
        try {
            const payloadBase64 = staffToken.split('.')[1];
            const paddedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(paddedPayload));
            return {
                userId: payload.sub,
                username: payload.username,
                locationCode: payload.locationCode,
                roleName: payload.roleName,
                roleCanAdd: payload.roleCanAdd,
                roleCanUpdate: payload.roleCanUpdate,
                roleCanDelete: payload.roleCanDelete,
            };
        } catch (e) {
            console.error("Error decoding staff token", e);
        }
    }
    return null;
};

// Get accessible locations based on user role and location
export const getAccessibleLocations = async (): Promise<AccessibleLocations> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/samurdhi-family/accessible-locations`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch accessible locations');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch accessible locations:', error);
        throw new Error(error.message || 'Failed to fetch accessible locations');
    }
};

export const getAreaTypes = async (filters?: AreaTypeFilters): Promise<AreaTypeItem[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // ADD VALIDATION BEFORE BUILDING QUERY PARAMS
        if (filters?.gnd_id && !/^[a-zA-Z0-9\-]+$/.test(filters.gnd_id)) {
            throw new Error('Invalid GND ID format');
        }
        if (filters?.district_id && !/^\d+$/.test(filters.district_id)) {
            throw new Error('Invalid district ID format');
        }
        if (filters?.ds_id && !/^\d+$/.test(filters.ds_id)) {
            throw new Error('Invalid DS ID format');
        }
        if (filters?.zone_id && !/^\d+$/.test(filters.zone_id)) {
            throw new Error('Invalid zone ID format');
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters?.district_id) queryParams.append('district_id', filters.district_id);
        if (filters?.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters?.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters?.gnd_id) queryParams.append('gnd_id', filters.gnd_id);
        if (filters?.mainProgram) queryParams.append('mainProgram', filters.mainProgram);
        if (filters?.areaClassification) queryParams.append('areaClassification', filters.areaClassification);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/area-types?${queryParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch area types');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch area types:', error);
        throw new Error(error.message || 'Failed to fetch area types');
    }
};

export const getUserDefaultLocation = async (): Promise<AreaTypeFilters> => {
    try {
        const locations = await getAccessibleLocations();
        const filters: AreaTypeFilters = {};

        // If user has access to only one location at each level, use that as default
        if (locations.districts.length === 1) {
            filters.district_id = locations.districts[0].district_id.toString();
        }
        if (locations.dss.length === 1) {
            filters.ds_id = locations.dss[0].ds_id.toString();
        }
        if (locations.zones.length === 1) {
            filters.zone_id = locations.zones[0].zone_id.toString();
        }
        if (locations.gndDivisions.length === 1) {
            filters.gnd_id = locations.gndDivisions[0].gnd_id;
        }

        return filters;
    } catch (error) {
        console.error('Failed to get user default location:', error);
        return {};
    }
};