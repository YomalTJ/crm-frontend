'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

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

        const response = await axiosInstance.get(`/samurdhi-family/count?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch samurdhi family count:', error);
        throw new Error('Failed to fetch samurdhi family count');
    }
};

export const getEmpowermentDimensions = async (): Promise<EmpowermentDimension[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get('/empowerment-dimension', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch empowerment dimensions:', error);
        throw new Error('Failed to fetch empowerment dimensions');
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

        const response = await axiosInstance.get(`/samurdhi-family/count/empowerment?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch empowerment dimension count:', error);
        throw new Error('Failed to fetch empowerment dimension count');
    }
};

// Future implementation for getting locations
export const getDistricts = async () => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get('/districts', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch {
        throw new Error('Failed to fetch districts');
    }
};

export const getDivisionalSecretariats = async (districtId: string) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/divisional-secretariats?district_id=${districtId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch {
        throw new Error('Failed to fetch divisional secretariats');
    }
};

export const getZones = async (dsId: string) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/zones?ds_id=${dsId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch {
        throw new Error('Failed to fetch zones');
    }
};

export const getGNDs = async (zoneId: string) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/gnds?zone_id=${zoneId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch {
        throw new Error('Failed to fetch GNDs');
    }
};