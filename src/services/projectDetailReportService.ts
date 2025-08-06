'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export interface ProjectDetailReportItem {
    family_mainProgram: 'NP' | 'ADB' | 'WB';
    family_beneficiaryName: string;
    family_gender: string;
    family_address: string;
    category: string;
    districtName: string;
    dsName: string;
    zoneName: string;
    gndName: string;
}

export interface ProjectDetailReportFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
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

// Get project detail report data
export const getProjectDetailReport = async (filters?: ProjectDetailReportFilters): Promise<ProjectDetailReportItem[]> => {
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
        const url = `/samurdhi-family/project-detail-report${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch project detail report:', error);
        throw new Error('Failed to fetch project detail report');
    }
};