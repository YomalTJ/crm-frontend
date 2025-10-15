/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

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

// Fetch beneficiary training data by NIC or HH
export const fetchBeneficiaryTrainingByIdentifier = async (
    nicNumber?: string,
    hhNumber?: string
): Promise<BeneficiaryTrainingResponse[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const params = new URLSearchParams();
        if (nicNumber) params.append('nic', nicNumber);
        if (hhNumber) params.append('hh', hhNumber);

        const url = `${baseUrl}/api/beneficiary-training?${params}`

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return []; // No existing records found
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch beneficiary training data');
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Error fetching beneficiary training data:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });

        // If it's a 404 error from the server, return empty array
        if (error.message?.includes('404') || error.response?.status === 404) {
            return [];
        }

        throw new Error(error.message || 'Failed to fetch beneficiary training data');
    }
};

// Create beneficiary training record
export const createBeneficiaryTraining = async (payload: BeneficiaryTrainingPayload) => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/beneficiary-training`, {
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
            throw new Error(error.error || 'Failed to create beneficiary training record');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create beneficiary training record');
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

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const params = new URLSearchParams();
        if (nicNumber) params.append('nic', nicNumber);
        if (hhNumber) params.append('hh', hhNumber);

        const response = await fetch(`${baseUrl}/api/beneficiary-training?${params}`, {
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
            throw new Error(error.error || 'Failed to update beneficiary training records');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to update beneficiary training records');
    }
};

// Fetch available courses
export const fetchCourses = async (): Promise<Course[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/courses`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!

            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch courses');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch courses');
    }
};