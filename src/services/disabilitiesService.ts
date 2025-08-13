'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export const getDisabilities = async () => {
    try {
        const token = (await cookies()).get('accessToken')?.value ||
            (await cookies()).get('staffAccessToken')?.value;

        const response = await axiosInstance.get('/disabilities', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching disabilities:', error);
        return [];
    }
};