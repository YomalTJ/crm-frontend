/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axiosInstance from "@/lib/axios";
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

        const response = await axiosInstance.get('/livelihoods', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching livelihoods:', error);
        throw new Error('Failed to fetch livelihoods');
    }
};

export const createLivelihood = async (data: CreateLivelihoodDto): Promise<Livelihood> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.post('/livelihoods', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating livelihood:', error);
        throw new Error('Failed to create livelihood');
    }
};

// Project Type Services
export const getProjectTypes = async (): Promise<ProjectType[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get('/project-type', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching project types:', error);
        throw new Error('Failed to fetch project types');
    }
};

export const getProjectTypesByLivelihood = async (livelihoodId: string): Promise<ProjectType[]> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get(`/project-type/livelihood/${livelihoodId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching project types by livelihood:', error);
        throw new Error('Failed to fetch project types by livelihood');
    }
};

export const createProjectType = async (data: CreateProjectTypeDto): Promise<ProjectType> => {
    try {
        const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.post('/project-type', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project type:', error);
        throw new Error('Failed to create project type');
    }
};