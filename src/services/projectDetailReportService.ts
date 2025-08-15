'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export interface ProjectDetailReportItem {
    family_id: string;
    family_beneficiaryName: string;
    family_beneficiaryGender: string;
    family_address: string;
    family_mainProgram: 'NP' | 'ADB' | 'WB';
    category: string;
    district_id: number;
    district_name: string;
    ds_id: number;
    ds_name: string;
    zone_id: number;
    zone_name: string;
    gnd_id: string;
    gnd_name: string;
}

export interface ProjectDetailReportFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
}

// Updated AccessibleLocations interface to match backend response
export interface AccessibleLocations {
    districts: {
        district_id: number; // Changed from 'id' to 'district_id'
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
        gnd_id: string; // Changed from 'id' to 'gnd_id'
        gnd_name: string;
        zone_id?: string;
    }[];
}

export interface UserLocationDetails {
    provinceId: number;
    district: { id: number; name: string } | null;
    dsDivision: { id: number; name: string } | null;
    zone: { id: number; name: string } | null;
    gnd: { id: string; name: string } | null;
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

// Get project detail report data with filters
export const getProjectDetails = async (filters?: ProjectDetailReportFilters): Promise<ProjectDetailReportItem[]> => {
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
        const url = `/samurdhi-family/project-details${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch project details:', error);
        throw new Error('Failed to fetch project details');
    }
};