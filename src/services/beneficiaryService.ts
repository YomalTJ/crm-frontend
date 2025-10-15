/* eslint-disable @typescript-eslint/no-explicit-any */
// beneficiaryService.ts
'use server'

import { cookies } from 'next/headers';

export interface BeneficiaryStatus {
  beneficiary_type_id: string;  // UUID format
  nameEnglish: string;
  nameSinhala: string;
  nameTamil: string;
  createdAt: string;
  created_by: string;
}

export const getBeneficiaryStatuses = async (): Promise<BeneficiaryStatus[]> => {
  try {
    const token =
      (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/beneficiary-status`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch beneficiary statuses');
    }

    const data = await response.json();
    
    // Transform the data to match the expected structure
    return data.map((item: any) => ({
      beneficiary_type_id: item.beneficiary_type_id,
      nameEnglish: item.nameEnglish,
      nameSinhala: item.nameSinhala,
      nameTamil: item.nameTamil,
      createdAt: item.createdAt,
      created_by: item.created_by
    }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch beneficiary statuses');
  }
};