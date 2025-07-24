'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export const getCurrentEmploymentOptions = async () => {
  try {
    // Get the token from cookies
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get('/current-employment', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch {
    throw new Error('Failed to fetch current employment options');
  }
};