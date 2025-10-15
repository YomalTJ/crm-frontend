/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { cookies } from 'next/headers';
import { AccessibleLocations } from "./projectDetailReportService";

export interface SamurdhiFamilyCountParams {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: string;
}

export interface SamurdhiFamilyCountResult {
    gndId: string;
    gndName: string;
    zoneName: string;
    dsName: string;
    districtName: string;
    count: string;
}

export interface SamurdhiFamilyCountResponse {
    results: SamurdhiFamilyCountResult[];
    totalCount: number;
}

export interface EmpowermentDimensionCountParams {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: string;
    empowerment_dimension_id?: string;
}

export interface EmpowermentDimensionCountResult {
    gndId: string;
    gndName: string;
    zoneName: string;
    dsName: string;
    districtName: string;
    empowermentId: string;
    empowermentName: string;
    count: string;
}

export interface EmpowermentDimensionCountResponse {
    results: EmpowermentDimensionCountResult[];
    totalCount: number;
}

export interface EmpowermentDimension {
    empowerment_dimension_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        locationCode: string;
        addedBy: string | null;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
    createdAt: string;
}

export const getSamurdhiFamilyCount = async (params: SamurdhiFamilyCountParams): Promise<SamurdhiFamilyCountResponse> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/samurdhi-family/count?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch samurdhi family count');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch samurdhi family count:', error);
        throw new Error(error.message || 'Failed to fetch samurdhi family count');
    }
};

export const getEmpowermentDimensions = async (): Promise<EmpowermentDimension[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/empowerment-dimension`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch empowerment dimensions');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch empowerment dimensions:', error);
        throw new Error(error.message || 'Failed to fetch empowerment dimensions');
    }
};

export const getEmpowermentDimensionCount = async (params: EmpowermentDimensionCountParams): Promise<EmpowermentDimensionCountResponse> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/samurdhi-family/count/empowerment?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch empowerment dimension count');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch empowerment dimension count:', error);
        throw new Error(error.message || 'Failed to fetch empowerment dimension count');
    }
};

export const getSamurdhiFamilyCountWithLocations = async (params: SamurdhiFamilyCountParams): Promise<{
    accessibleLocations: AccessibleLocations;
    countData: SamurdhiFamilyCountResponse;
}> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/samurdhi-family/count-report?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch samurdhi family count with locations');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch samurdhi family count with locations:', error);
        throw new Error(error.message || 'Failed to fetch samurdhi family count with locations');
    }
};

export const getEmpowermentDimensionCountWithLocations = async (params: EmpowermentDimensionCountParams): Promise<{
    accessibleLocations: AccessibleLocations;
    countData: EmpowermentDimensionCountResponse;
}> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/samurdhi-family/empowerment-count-report?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch empowerment dimension count with locations');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch empowerment dimension count with locations:', error);
        throw new Error(error.message || 'Failed to fetch empowerment dimension count with locations');
    }
};