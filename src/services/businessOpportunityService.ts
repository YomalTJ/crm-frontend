/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from 'next/headers';

// Types
export interface Livelihood {
    id: number;
    english_name: string;
    sinhala_name: string;
    tamil_name: string;
}

export interface ProjectType {
    project_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdBy: any;
    livelihood: Livelihood;
    createdAt: string;
}

export interface CreateLivelihoodDto {
    english_name: string;
    sinhala_name: string;
    tamil_name: string;
}

export interface CreateProjectTypeDto {
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    livelihoodId: string;
}

// Livelihood Services
export const getLivelihoods = async (): Promise<Livelihood[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/livelihoods`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch livelihoods');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch livelihoods');
    }
};

export const createLivelihood = async (data: CreateLivelihoodDto): Promise<Livelihood> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/livelihoods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create livelihood');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create livelihood');
    }
};

// Project Type Services
export const getProjectTypesByLivelihood = async (livelihoodId: string): Promise<ProjectType[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/project-types/livelihood/${livelihoodId}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch project types by livelihood');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch project types by livelihood');
    }
};

export const createProjectType = async (data: CreateProjectTypeDto): Promise<ProjectType> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/project-type`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create project type');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create project type');
    }
};