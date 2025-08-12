/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

export interface SamurdhiFamilyPayload {
  district_id: string;
  ds_id: string;
  zone_id: string;
  gnd_id: string;
  mainProgram: string;
  beneficiary_type_id: string;
  hasConsentedToEmpowerment?: boolean;
  consentGivenAt?: string | null;
  aswasumaHouseholdNo: string | null;
  nic: string | null;
  beneficiaryName: string | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  projectOwnerAge: number;
  male18To60: number;
  female18To60: number;
  employment_id: string | null;
  otherOccupation: string | null;
  subsisdy_id: string | null;
  aswesuma_cat_id: string | null;
  empowerment_dimension_id: string | null;
  project_type_id: string | null;
  otherProject: string | null;
  childName?: string | null;
  childAge?: number;
  childGender?: string | null;
  job_field_id: string | null;
  otherJobField?: string | null;
  // Updated to arrays
  resource_id: string[];
  monthlySaving: boolean;
  savingAmount: number;
  health_indicator_id: string[];
  domestic_dynamic_id: string[];
  community_participation_id: string[];
  housing_service_id: string[];
}

export interface BeneficiaryDetailsResponse {
  name: string;
  householdNumber: string | null;
  gender: string;
  address: string;
  phone: string;
  age: number;
  members18To60: {
    male: number;
    female: number;
  };
  mainProgram: string;
  hasConsentedToEmpowerment: boolean | null;
  consentGivenAt: string | null;
  beneficiary_type_id: string;
  employment_id: string;
  otherOccupation: string | null;
  subsisdy_id: string;
  aswesuma_cat_id: string;
  empowerment_dimension_id: string | null;
  project_type_id: string;
  otherProject: string | null;
  childName: string | null;
  childAge: number | null;
  childGender: string | null;
  job_field_id: string;
  otherJobField: string | null;
  resource_id: string[];
  monthlySaving: boolean;
  savingAmount: number;
  health_indicator_id: string[];
  domestic_dynamic_id: string[];
  community_participation_id: string[];
  housing_service_id: string[];
  // Add location data
  location: {
    district: {
      id: number;
      name: string;
    };
    divisionalSecretariat: {
      id: number;
      name: string;
    };
    samurdhiBank: {
      id: number;
      name: string;
    };
    gramaNiladhariDivision: {
      id: string;
      name: string;
    };
  };
  // Add beneficiary type details
  beneficiaryType: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  currentEmployment: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  samurdhiSubsidy: {
    id: string;
    amount: string;
  };
  aswasumaCategory: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  empowermentDimension: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  projectType: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  jobField: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  resources: Array<{
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }>;
  healthIndicators: Array<{
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }>;
  domesticDynamics: Array<{
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }>;
  communityParticipations: Array<{
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }>;
  housingServices: Array<{
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }>;
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

// DEPRECATED: Remove this method and use getBeneficiaryByIdentifier instead
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

// Updated method to handle both NIC and household numbers
export const getBeneficiaryByIdentifier = async (identifier: string): Promise<BeneficiaryDetailsResponse> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.get(`/samurdhi-family/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch beneficiary details');
  }
};

// DEPRECATED: Remove this method and use updateSamurdhiFamilyByIdentifier instead
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

// Updated method to handle both NIC and household numbers for updates
export const updateSamurdhiFamilyByIdentifier = async (identifier: string, payload: SamurdhiFamilyPayload) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.put(`/samurdhi-family/${encodeURIComponent(identifier)}`, payload, {
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
