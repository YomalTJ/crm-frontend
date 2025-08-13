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
  areaClassification?: 'URBAN' | 'RURAL' | 'ESTATE' | null;

  // Enhanced consent fields
  hasConsentedToEmpowerment?: boolean | null;
  hasObtainedConsentLetter?: boolean | null;
  refusal_reason_id?: string | null;
  consentGivenAt?: string | null;

  // Basic info
  aswasumaHouseholdNo: string | null;
  nic: string | null;
  beneficiaryName: string | null;
  beneficiaryGender: string | null; // Note: backend uses beneficiaryGender not gender
  address: string | null;
  phone: string | null;

  // Project owner details
  projectOwnerName?: string | null;
  projectOwnerAge: number;
  projectOwnerGender?: string | null;

  // Disability
  disability_id?: string | null;

  // Household members
  male18To60: number;
  female18To60: number;

  // Employment
  employment_id: string | null;
  otherOccupation: string | null;

  // Benefits
  subsisdy_id: string | null;
  aswesuma_cat_id: string | null;

  // Empowerment
  empowerment_dimension_id: string | null;
  project_type_id: string | null;
  otherProject: string | null;

  // Child details
  childName?: string | null;
  childAge?: number;
  childGender?: string | null;
  job_field_id: string | null;
  otherJobField?: string | null;

  // Array fields
  resource_id: string[];
  monthlySaving: boolean;
  savingAmount: number;
  health_indicator_id: string[];
  domestic_dynamic_id: string[];
  community_participation_id: string[];
  housing_service_id: string[];

  // Banking details
  commercialBankAccountName?: string | null;
  commercialBankAccountNumber?: string | null;
  commercialBankName?: string | null;
  commercialBankBranch?: string | null;
  samurdhiBankAccountName?: string | null;
  samurdhiBankAccountNumber?: string | null;
  samurdhiBankName?: string | null;
  samurdhiBankAccountType?: string | null;
}

export interface BeneficiaryDetailsResponse {
  beneficiaryDetails: {
    name: string;
    gender: string;
  };
  mainProgram: string;
  householdNumber: string;
  address: string;
  phone: string;
  projectOwnerDetails: {
    name: string;
    age: number;
    gender: string;
  };
  disability: any; // null or disability object
  members18To60: {
    male: number;
    female: number;
  };
  hasConsentedToEmpowerment: boolean;
  hasObtainedConsentLetter: boolean;
  refusalReason: any;
  consentGivenAt: string | null;
  beneficiaryType: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  areaClassification: string;
  currentEmployment: {
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  };
  otherOccupation: string | null;
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
  otherProject: string | null;
  childName: string | null;
  childAge: number;
  childGender: string;
  jobField: any; // null or job field object
  otherJobField: string | null;
  resources: Array<{
    id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
  }>;
  monthlySaving: boolean;
  savingAmount: number;
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
    commercialBankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch: string;
    };
    samurdhiBankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      accountType: string;
    };
  };
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
