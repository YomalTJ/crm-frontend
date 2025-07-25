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
    aswasumaHouseholdNo: string;
    nic: string;
    beneficiaryName: string;
    gender: string;
    address: string;
    phone: string;
    projectOwnerAge: number;
    male18To60: number;
    female18To60: number;
    employment_id: string;
    otherOccupation: string;
    subsisdy_id: string;
    aswesuma_cat_id: string;
    empowerment_dimension_id: string;
    project_type_id: string;
    otherProject: string;
    childName?: string;
    childAge?: number;
    childGender?: string;
    job_field_id: string;
    otherJobField?: string;
    resource_id: string; // Changed from array to single string
    monthlySaving: boolean;
    savingAmount: number;
    health_indicator_id: string; // Changed from array to single string
    domestic_dynamic_id: string; // Changed from array to single string
    community_participation_id: string; // Changed from array to single string
    housing_service_id: string; // Changed from array to single string
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