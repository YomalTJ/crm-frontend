/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axiosInstance from '@/lib/axios';
import { cookies } from 'next/headers';

export interface BeneficiaryTrainingPayload {
    districtId?: string;
    dsId?: string;
    zoneId?: string;
    gndId?: string;
    hhNumber?: string;
    nicNumber?: string;
    name: string;
    address: string;
    phoneNumber: string;
    trainingActivitiesDone?: boolean;
    trainingActivitiesRequired?: boolean;
    courseId?: number;
    trainingInstitution?: string;
    trainingInstituteAddress?: string;
    trainingInstitutePhone?: string;
    courseCost?: number;
    trainingDuration?: string;
    trainerName?: string;
    trainerContactNumber?: string;
}

export interface BeneficiaryTrainingResponse extends BeneficiaryTrainingPayload {
    id: number;

    // Location details with names (nullable)
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

    course?: {
        id: number;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };
}

export interface Course {
    id: number;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
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

// Fetch beneficiary training data by NIC or HH
export const fetchBeneficiaryTrainingByIdentifier = async (
    nicNumber?: string,
    hhNumber?: string
): Promise<BeneficiaryTrainingResponse[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        console.log('Fetching training data with:', { nicNumber, hhNumber, token: !!token });

        const params = new URLSearchParams();

        // Priority 1: Search by NIC if available
        if (nicNumber) {
            params.append('nic', nicNumber);
        }
        // Priority 2: Search by HH number if no NIC
        else if (hhNumber) {
            params.append('hh', hhNumber);
        }

        const url = `/beneficiary-training/search/by-identifier?${params}`;
        console.log('API URL:', url);

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 404) {
            return []; // No existing records found
        }
        throw new Error('Failed to fetch beneficiary training data');
    }
};

// Create beneficiary training record
export const createBeneficiaryTraining = async (payload: BeneficiaryTrainingPayload) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.post('/beneficiary-training', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create beneficiary training record');
    }
};

// Update beneficiary training records by NIC or HH
export const updateBeneficiaryTrainingByIdentifier = async (
    payload: Partial<BeneficiaryTrainingPayload>,
    nicNumber?: string,
    hhNumber?: string
) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const params = new URLSearchParams();
        if (nicNumber) params.append('nic', nicNumber);
        if (hhNumber) params.append('hh', hhNumber);

        const response = await axiosInstance.put(`/beneficiary-training/update/by-identifier?${params}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update beneficiary training records');
    }
};

// Fetch available courses
export const fetchCourses = async (): Promise<Course[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get('/course', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw new Error('Failed to fetch courses');
    }
};