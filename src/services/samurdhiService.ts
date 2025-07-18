/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";

interface SamurdhiFamilyPayload {
  district: string;
  divisionalSecretariat: string;
  samurdhiBank: string;
  gramaNiladhariDivision: string;
  beneficiaryType: string;
  aswasumaHouseholdNo: string;
  nic: string;
  beneficiaryName: string;
  gender: string;
  address: string;
  phone: string;
  projectOwnerAge: number;
  male18To60: number;
  female18To60: number;
  currentEmployment: string;
  otherOccupation: string;
  samurdhiSubsidy: string;
  aswasumaCategory: string;
  empowermentDimension: string;
  projectType: string;
  otherProject: string;
  resourcesNeeded: string[];
  monthlySaving: boolean;
  savingAmount: number;
  healthInfo: string[];
  domesticDynamics: string[];
  communityParticipation: string[];
  housingServices: string[];
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