/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

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

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/samurdhi-family/${nicOrHh}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch beneficiary data');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch beneficiary data');
    }
};

// Fetch business empowerment data by NIC
export const fetchBusinessEmpowermentByNic = async (nic: string): Promise<BusinessEmpowermentResponse | null> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/business-empowerment/nic/${nic}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // No existing record found
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch business empowerment data');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch business empowerment data');
    }
};

// Create business empowerment record
export const createBusinessEmpowerment = async (payload: BusinessEmpowermentPayload) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/business-empowerment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create business empowerment record');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create business empowerment record');
    }
};

// Update business empowerment record by NIC
export const updateBusinessEmpowermentByNic = async (nic: string, payload: Partial<BusinessEmpowermentPayload>) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/business-empowerment/nic/${nic}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update business empowerment record');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to update business empowerment record');
    }
};

// Fetch job fields
export const fetchJobFields = async (): Promise<JobField[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/job-field`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch job fields');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch job fields');
    }
};