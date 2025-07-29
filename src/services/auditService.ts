/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

export interface AuditEntry {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  oldData: Record<string, any> | null;
  newData: Record<string, any> | null;
  performedBy: string;
  performedAt: string;
  performedByName: string;
  performedByRole: string;
}

export const getAudits = async (): Promise<AuditEntry[]> => {
  try {
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get('/audit', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch {
    throw new Error('Failed to fetch audit logs');
  }
};