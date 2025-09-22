/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export interface GrantUtilizationPayload {
  hhNumberOrNic: string; // Required field (not nullable)

  districtId?: string | null;
  dsId?: string | null;
  zoneId?: string | null;
  gndId?: string | null;

  // Basic grant information (required fields)
  amount: number;
  grantDate: string;

  financialAid?: number | null;
  interestSubsidizedLoan?: number | null;
  samurdiBankLoan?: number | null;

  // Livelihood/Self-employment section (nullable optional fields)
  purchaseDate?: string | null;
  equipmentPurchased?: string | null;
  animalsPurchased?: string | null;
  plantsPurchased?: string | null;
  othersPurchased?: string | null;
  projectStartDate?: string | null;

  // Employment/Training section (nullable optional fields)
  employmentOpportunities?: string | null;
  traineeName?: string | null;
  traineeAge?: number | null;
  traineeGender?: string | null;
  courseName?: string | null;
  institutionName?: string | null;
  courseFee?: number | null;
  courseDuration?: string | null;
  courseStartDate?: string | null;
  courseEndDate?: string | null;
}

export interface GrantUtilizationResponse {
  id: string;
  amount: number;
  grantDate: string;
  purchaseDate?: string;
  equipmentPurchased?: string;
  animalsPurchased?: string;
  plantsPurchased?: string;
  othersPurchased?: string;
  projectStartDate?: string;
  employmentOpportunities?: string;
  traineeName?: string;
  traineeAge?: number;
  traineeGender?: string;
  courseName?: string;
  institutionName?: string;
  courseFee?: number;
  courseDuration?: string;
  courseStartDate?: string;
  courseEndDate?: string;
  samurdhiFamily: {
    id: string;
    beneficiaryName: string;
    nic: string;
    address: string;
  };
  district: {
    district_id: string;
    name: string;
  };
  divisionalSecretariat: {
    ds_id: string;
    name: string;
  };
  gramaNiladhariDivision: {
    gnd_id: string;
    name: string;
  };
  samurdhiBank: {
    zone_id: string;
    name: string;
  };
}

export const createGrantUtilization = async (payload: GrantUtilizationPayload): Promise<GrantUtilizationResponse> => {
  try {
    // Get the token from cookies
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.post('/grant-utilization', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create Grant Utilization record');
  }
};

export const getGrantUtilizationById = async (id: string): Promise<GrantUtilizationResponse> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/grant-utilization/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Grant Utilization details');
  }
};

export const updateGrantUtilization = async (hhNumberOrNic: string, payload: GrantUtilizationPayload): Promise<GrantUtilizationResponse> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.put(`/grant-utilization/${hhNumberOrNic}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Grant Utilization record');
  }
};

export const getAllGrantUtilizations = async (filters?: any): Promise<GrantUtilizationResponse[]> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }

    const response = await axiosInstance.get(`/grant-utilization?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Grant Utilization records');
  }
};

export const checkGrantUtilizationExists = async (hhNumberOrNic: string): Promise<boolean> => {
  try {
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/grant-utilization/family/${hhNumberOrNic}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // If we get a successful response and there are grant utilizations, return true
    return response.data.grantUtilizations && response.data.grantUtilizations.length > 0;
  } catch (error: any) {
    // If it's a 404 error, it means no records exist
    if (error.response?.status === 404) {
      return false;
    }
    throw new Error(error.response?.data?.message || 'Failed to check Grant Utilization existence');
  }
};

// Add this function to get existing grant utilizations
export const getGrantUtilizationsByHhNumberOrNic = async (hhNumberOrNic: string): Promise<any> => {
  try {
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/grant-utilization/family/${hhNumberOrNic}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Grant Utilization records');
  }
};