/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from "next/headers";

export interface AccountType {
  samurdhi_bank_account_type_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getAccountTypes = async (): Promise<AccountType[]> => {
  try {
    const token =
      (await cookies()).get("accessToken")?.value ||
      (await cookies()).get("staffAccessToken")?.value;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/account-types`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch account types");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch account types");
  }
};
