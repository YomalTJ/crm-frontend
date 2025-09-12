'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

// Refusal Reason Response Interface
export interface RefusalReasonItem {
    beneficiaryName: string;
    nic: string;
    mobilePhone: string;
    address: string;
    mainProgram: 'NP' | 'ADB' | 'WB';
    refusalReason: {
        id: number;
        reason_si: string;
        reason_en: string;
        reason_ta: string;
    };
    location: {
        district?: {
            district_id: string;
            district_name: string;
        };
        ds?: {
            ds_id: string;
            ds_name: string;
        };
        zone?: {
            zone_id: string;
            zone_name: string;
        };
        gnd?: {
            gnd_id: string;
            gnd_name: string;
        };
    };
    createdAt: Date;
}

// Filter interface for refusal reasons
export interface RefusalReasonFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
}

// AccessibleLocations interface (reusing from project owners)
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

        const response = await axiosInstance.get('/samurdhi-family/accessible-locations', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch accessible locations:', error);
        throw new Error('Failed to fetch accessible locations');
    }
};

// Get refusal reasons data with filters
export const getRefusalReasons = async (filters?: RefusalReasonFilters): Promise<RefusalReasonItem[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters?.district_id) queryParams.append('district_id', filters.district_id);
        if (filters?.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters?.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters?.gnd_id) queryParams.append('gnd_id', filters.gnd_id);
        if (filters?.mainProgram) queryParams.append('mainProgram', filters.mainProgram);

        const queryString = queryParams.toString();
        const url = `/beneficiaries/empowerment-refusals${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch refusal reasons:', error);
        throw new Error('Failed to fetch refusal reasons');
    }
};

// Get user default location
export const getUserDefaultLocation = async (): Promise<RefusalReasonFilters> => {
    try {
        const locations = await getAccessibleLocations();
        const filters: RefusalReasonFilters = {};

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