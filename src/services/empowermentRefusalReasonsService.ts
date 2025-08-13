'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export const getEmpowermentRefusalReasons = async () => {
    try {
        const token = (await cookies()).get('accessToken')?.value ||
            (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get('/empowerment-refusal-reasons', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching refusal reasons:', error);
        return [];
    }
};