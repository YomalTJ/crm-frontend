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
  hasConsentedToEmpowerment: boolean | null;
  consentLetterPath?: string | null; // NEW
  refusal_reason_id: string | null;
  consentGivenAt: string | null;
  beneficiary_type_id: string;
  areaClassification: string | null;
  aswasumaHouseholdNo: string | null;
  nic: string | null;
  beneficiaryName: string | null;
  beneficiaryGender: string | null; // RENAMED from gender
  address: string | null;
  mobilePhone: string | null; // RENAMED from phone
  telephone?: string | null; // NEW
  projectOwnerName: string | null;
  projectOwnerAge: number;
  projectOwnerGender: string | null;
  hasDisability: boolean; // NEW
  disability_id: string | null;

  // UPDATED age ranges
  male16To24: number; // NEW
  female16To24: number; // NEW
  male25To45: number; // NEW
  female25To45: number; // NEW
  male46To60: number; // NEW
  female46To60: number; // NEW
  // REMOVE: male18To60, female18To60

  employment_id: string | null;
  otherOccupation: string | null;
  subsisdy_id: string | null;
  aswesuma_cat_id: string | null;
  empowerment_dimension_id: string | null;
  project_type_id: string | null;
  otherProject: string | null;
  childName: string | null;
  childAge: number;
  childGender: string;
  job_field_id: string | null;
  otherJobField: string | null;
  resource_id: string[];
  monthlySaving: boolean;
  savingAmount: number;
  health_indicator_id: string[];
  domestic_dynamic_id: string[];
  community_participation_id: string[];
  housing_service_id: string[];
  commercialBankAccountName: string | null;
  commercialBankAccountNumber: string | null;
  commercialBankName: string | null;
  commercialBankBranch: string | null;
  samurdhiBankAccountName: string | null;
  samurdhiBankAccountNumber: string | null;
  samurdhiBankName: string | null;
  samurdhiBankAccountType: string | null;

  // NEW fields
  wantsAswesumaBankTransfer: boolean;
  otherBankName?: string | null;
  otherBankBranch?: string | null;
  otherBankAccountHolder?: string | null;
  otherBankAccountNumber?: string | null;
  hasOtherGovernmentSubsidy: boolean;
  otherGovernmentInstitution?: string | null;
  otherSubsidyAmount?: number | null;
}

export interface BeneficiaryDetailsResponse {
    beneficiaryDetails: {
        name: string;
        gender: string;
    };
    mainProgram: string;
    householdNumber: string;
    address: string;
    mobilePhone: string;
    telephone?: string;
    projectOwnerDetails: {
        name: string;
        age: number;
        gender: string;
    };
    hasDisability: boolean;
    disability: any;
    noOfMembers: {
        male: {
            age16To24: number;
            age25To45: number;
            age46To60: number;
            total: number;
        };
        female: {
            age16To24: number;
            age25To45: number;
            age46To60: number;
            total: number;
        };
        overallTotal: number;
    };
    hasConsentedToEmpowerment: boolean;
    consentLetterPath?: string;
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
    } | null;
    aswasumaCategory: {
        id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    } | null;
    empowermentDimension: {
        id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    } | null;
    projectType: {
        id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    } | null;
    otherProject: string | null;
    childName: string | null;
    childAge: number;
    childGender: string;
    jobField: {
        id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    } | null;
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
    bankTransferPreferences: {
        wantsAswesumaBankTransfer: boolean;
        otherBankDetails: {
            bankName: string | null;
            branch: string | null;
            accountHolder: string | null;
            accountNumber: string | null;
        };
    };
    governmentSubsidy: {
        hasOtherGovernmentSubsidy: boolean;
        institution: string | null;
        amount: number | null;
    };
    location: {
        district: {
            id: number;
            name: string;
        } | null;
        divisionalSecretariat: {
            id: number;
            name: string;
        } | null;
        samurdhiBank: {
            id: number;
            name: string;
        } | null;
        gramaNiladhariDivision: {
            id: string;
            name: string;
        } | null;
        commercialBankDetails: {
            accountName: string | null;
            accountNumber: string | null;
            bankName: string | null;
            branch: string | null;
        };
        samurdhiBankDetails: {
            accountName: string | null;
            accountNumber: string | null;
            bankName: string | null;
            accountType: string | null;
        };
    };
}

// FIXED: Updated createSamurdhiFamily to handle both JSON payload and FormData with files
export const createSamurdhiFamily = async (payload: SamurdhiFamilyPayload, file?: File) => {
  try {
    // Get the token from cookies
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    let response;

    if (file) {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all payload fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      // Add the file
      formData.append('consentLetter', file);

      response = await axiosInstance.post('/samurdhi-family', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // Send JSON payload without file
      response = await axiosInstance.post('/samurdhi-family', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

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

// FIXED: Updated updateSamurdhiFamily to handle both JSON payload and FormData with files
export const updateSamurdhiFamily = async (nic: string, payload: SamurdhiFamilyPayload, file?: File) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    let response;

    if (file) {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all payload fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      // Add the file
      formData.append('consentLetter', file);

      response = await axiosInstance.put(`/samurdhi-family/${nic}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // Send JSON payload without file
      response = await axiosInstance.put(`/samurdhi-family/${nic}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Samurdhi family record');
  }
};

// Updated method to handle both NIC and household numbers for updates
export const updateSamurdhiFamilyByIdentifier = async (identifier: string, payload: SamurdhiFamilyPayload, file?: File) => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    let response;

    if (file) {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all payload fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      // Add the file
      formData.append('consentLetter', file);

      response = await axiosInstance.put(`/samurdhi-family/${encodeURIComponent(identifier)}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // Send JSON payload without file
      response = await axiosInstance.put(`/samurdhi-family/${encodeURIComponent(identifier)}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

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