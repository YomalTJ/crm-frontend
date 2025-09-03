'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export interface BeneficiaryFilters {
    page?: number;
    limit?: number;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    beneficiaryType?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
}

export interface Beneficiary {
    aswasumaHouseholdNo: string | null;
    id: string;
    beneficiaryName: string;
    nic: string | null;
    phone: string;
    address: string;
    district: string;
    ds: string;
    zone: string;
    gnd: string;
    beneficiaryType: string;
    currentEmployment: string;
    createdAt: string;
    createdBy: string;
    mainProgram: 'NP' | 'ADB' | 'WB';
}

export interface BeneficiaryResponse {
    data: Beneficiary[];
    meta: {
        total: number;
        page: number;
        last_page: number;
    };
}

export const getBeneficiaries = async (filters: BeneficiaryFilters = {}): Promise<BeneficiaryResponse> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Build query parameters
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.mainProgram) params.append('mainProgram', filters.mainProgram);
        if (filters.beneficiaryType) params.append('beneficiaryType', filters.beneficiaryType);
        if (filters.fromDate) params.append('fromDate', filters.fromDate);
        if (filters.toDate) params.append('toDate', filters.toDate);
        if (filters.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `/samurdhi-family/created-by-me${queryString ? `?${queryString}` : ''}`;

        console.log('API Request URL:', url); // Debug the URL being called
        console.log('Filters being sent:', filters); // Debug the filters

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', response.data); // Debug the response
        return response.data;
    } catch (error) {
        console.error('Failed to fetch beneficiaries:', error);
        throw new Error('Failed to fetch beneficiaries');
    }
};

export const deleteBeneficiary = async (id: string): Promise<void> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        await axiosInstance.delete(`/samurdhi-family/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Failed to delete beneficiary:', error);
        throw new Error('Failed to delete beneficiary');
    }
};