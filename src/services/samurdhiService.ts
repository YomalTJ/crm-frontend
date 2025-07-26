/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export interface SamurdhiFamilyPayload {
  district_id: string;
  ds_id: string;
  zone_id: string;
  gnd_id: string;
  beneficiary_type_id: string;
  aswasumaHouseholdNo: string | null;  // Changed to allow null
  nic: string | null;                  // Changed to allow null
  beneficiaryName: string | null;      // Changed to allow null
  gender: string | null;               // Changed to allow null
  address: string | null;              // Changed to allow null
  phone: string | null;                // Changed to allow null
  projectOwnerAge: number;
  male18To60: number;
  female18To60: number;
  employment_id: string | null;        // Changed to allow null
  otherOccupation: string | null;      // Already nullable
  subsisdy_id: string | null;          // Changed to allow null
  aswesuma_cat_id: string | null;      // Changed to allow null
  empowerment_dimension_id: string | null; // Changed to allow null
  project_type_id: string | null;      // Changed to allow null
  otherProject: string | null;         // Changed to allow null
  childName?: string | null;           // Already optional and nullable
  childAge?: number;                   // Keep as is
  childGender?: string | null;         // Already optional and nullable
  job_field_id: string | null;         // Changed to allow null
  otherJobField?: string | null;       // Already optional and nullable
  resource_id: string | null;          // Changed to allow null (was single string, now nullable)
  monthlySaving: boolean;
  savingAmount: number;
  health_indicator_id: string | null;  // Changed to allow null
  domestic_dynamic_id: string | null;  // Changed to allow null
  community_participation_id: string | null; // Changed to allow null
  housing_service_id: string | null;   // Changed to allow null
}

export const createSamurdhiFamily = async (payload: SamurdhiFamilyPayload) => {
  try {
    // Get the token from cookies
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.post('/samurdhi-family', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create Samurdhi family record');
  }
};

export const getBeneficiaryByNIC = async (nic: string) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/samurdhi-family/${nic}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch beneficiary details');
  }
};

export const updateSamurdhiFamily = async (nic: string, payload: SamurdhiFamilyPayload) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.put(`/samurdhi-family/${nic}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Samurdhi family record');
  }
};

export const getHouseholdNumbersByGnCode = async (gnCode: string) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/household-citizen/by-gn-code/${gnCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.hhReferences || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch household numbers');
  }
};

export const getHouseholdDetailsByReference = async (hhReference: string) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/household-citizen/${hhReference}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch household details');
  }
};