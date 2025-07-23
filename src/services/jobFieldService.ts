'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export const getJobFields = async () => {
  try {
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get('/job-field', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch {
    throw new Error('Failed to fetch job fields');
  }
};