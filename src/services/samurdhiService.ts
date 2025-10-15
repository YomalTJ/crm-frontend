/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { getAuthToken, getBaseUrl, handleApiResponse } from "@/lib/api-utils";

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
  beneficiaryAge: number;
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
  maleBelow16: number;   // NEW
  femaleBelow16: number; // NEW

  male16To24: number;    // NEW
  female16To24: number;  // NEW

  male25To45: number;    // NEW
  female25To45: number;  // NEW

  male46To60: number;    // NEW
  female46To60: number;  // NEW

  maleAbove60: number;   // NEW
  femaleAbove60: number; // NEW

  // REMOVE: male18To60, female18To60

  employment_id: string | null;
  otherOccupation: string | null;
  subsisdy_id: string | null;
  aswesuma_cat_id: string | null;
  empowerment_dimension_id: string | null;
  livelihood_id: string | null;
  project_type_id: string | null;
  otherProject: string | null;
  childName: string | null;
  childAge: number | null;
  childGender: string | null;
  job_field_id: string | null;
  otherJobField: string | null;
  resource_id: string[];
  monthlySaving: boolean;
  savingAmount: number | null;
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
  samurdhiBankAccountType: number | null;

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
    age: number;
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
      ageBelow16: number;
      ageAbove60: number;
      age16To24: number;
      age25To45: number;
      age46To60: number;
      total: number;
    };
    female: {
      ageBelow16: number;
      ageAbove60: number;
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
  selectedLivelihood: string;
  livelihood: {
    id: string;
    english_name: string;
    sinhala_name: string;
    tamil_name: string;
  } | null,
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
      accountType: number | null;
    };
  };
}

export const createSamurdhiFamily = async (payload: SamurdhiFamilyPayload, file?: File) => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    if (file) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      formData.append('consentLetter', file);

      const response = await fetch(`${baseUrl}/api/samurdhi-family`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-app-key': process.env.APP_AUTH_KEY!
        },
        body: formData
      });

      return await handleApiResponse(response);
    } else {
      const response = await fetch(`${baseUrl}/api/samurdhi-family`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-app-key': process.env.APP_AUTH_KEY!
        },
        body: JSON.stringify(payload)
      });

      return await handleApiResponse(response);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create Samurdhi family record');
  }
};

export const getBeneficiaryByIdentifier = async (identifier: string): Promise<BeneficiaryDetailsResponse> => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/samurdhi-family/${identifier}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch beneficiary details');
  }
};

export const updateSamurdhiFamily = async (identifier: string, payload: SamurdhiFamilyPayload, file?: File) => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    if (file) {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      formData.append('consentLetter', file);

      const response = await fetch(`${baseUrl}/api/samurdhi-family/${identifier}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-app-key': process.env.APP_AUTH_KEY!
        },
        body: formData
      });

      return await handleApiResponse(response);
    } else {
      const response = await fetch(`${baseUrl}/api/samurdhi-family/${identifier}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-app-key': process.env.APP_AUTH_KEY!
        },
        body: JSON.stringify(payload)
      });

      return await handleApiResponse(response);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update Samurdhi family record');
  }
};

export const getHouseholdNumbersByGnCode = async (gnCode: string) => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/household-citizen?gnCode=${encodeURIComponent(gnCode)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    const data = await handleApiResponse(response);
    return data.hhReferences || [];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch household numbers');
  }
};

export const getHouseholdDetailsByReference = async (hhReference: string) => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/household-citizen?hhReference=${encodeURIComponent(hhReference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch household details');
  }
};

export const checkExistingBeneficiary = async (identifier: string, type: 'nic' | 'household'): Promise<{ exists: boolean; message?: string; beneficiaryName?: string }> => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/samurdhi-family?checkExists=true&type=${type}&identifier=${encodeURIComponent(identifier)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to check existing beneficiary');
  }
};

export const getLivelihoods = async (): Promise<any[]> => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/livelihoods`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch livelihoods');
  }
};

export const getProjectTypesByLivelihood = async (livelihoodId: number): Promise<any[]> => {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/api/project-types?livelihoodId=${livelihoodId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch project types');
  }
};