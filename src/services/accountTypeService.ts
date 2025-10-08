/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export interface AccountType {
  samurdhi_bank_account_type_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getAccountTypes = async (): Promise<AccountType[]> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get('/account-types', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch account types');
  }
};