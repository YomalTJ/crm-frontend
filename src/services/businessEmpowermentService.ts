/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axiosInstance from '@/lib/axios';
import { cookies } from 'next/headers';

export interface BusinessEmpowermentPayload {
    nic: string;
    name: string;
    phone: string;
    address: string;
    district_id: string;
    ds_id: string;
    zone_id: string;
    gnd_id: string;
    livelihood_id?: string;
    project_type_id?: string;
    job_field_id?: string;
    governmentContribution?: number;
    beneficiaryContribution?: number;
    bankLoan?: number;
    linearOrganizationContribution?: number;
    total?: number;
    capitalAssets?: string;
    expectedMonthlyProfit?: number;
    advisingMinistry?: string;
    officerName?: string;
    officerPosition?: string;
    officerMobileNumber?: string;
    developmentOfficer?: string;
    projectManager?: string;
    technicalOfficer?: string;
    divisionalSecretary?: string;
}

export interface BusinessEmpowermentResponse extends BusinessEmpowermentPayload {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    // Additional fields for enriched response
    district_name?: string;
    ds_name?: string;
    zone_name?: string;
    gnd_name?: string;
    livelihood_name?: string;
    livelihood_sinhala_name?: string;
    livelihood_tamil_name?: string;
    project_type_name_english?: string;
    project_type_name_sinhala?: string;
    project_type_name_tamil?: string;
    job_field_name_english?: string;
    job_field_name_sinhala?: string;
    job_field_name_tamil?: string;
}

export interface JobField {
    job_field_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdBy: any;
    createdAt: string;
}

// Fetch beneficiary data by NIC or HH number
export const fetchBeneficiaryData = async (nicOrHh: string) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get(`/samurdhi-family/${nicOrHh}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary data:', error);
        throw new Error('Failed to fetch beneficiary data');
    }
};

// Fetch business empowerment data by NIC
export const fetchBusinessEmpowermentByNic = async (nic: string): Promise<BusinessEmpowermentResponse | null> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get(`/business-empowerment/nic/${nic}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null; // No existing record found
        }
        console.error('Error fetching business empowerment data:', error);
        throw new Error('Failed to fetch business empowerment data');
    }
};

// Create business empowerment record
export const createBusinessEmpowerment = async (payload: BusinessEmpowermentPayload) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.post('/business-empowerment', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create business empowerment record');
    }
};

// Update business empowerment record by NIC
export const updateBusinessEmpowermentByNic = async (nic: string, payload: Partial<BusinessEmpowermentPayload>) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.put(`/business-empowerment/nic/${nic}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update business empowerment record');
    }
};

export const fetchJobFields = async (): Promise<JobField[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get('/job-field', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching job fields:', error);
        throw new Error('Failed to fetch job fields');
    }
};