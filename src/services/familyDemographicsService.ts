'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

// Family Demographics Response Interface
export interface FamilyDemographicsItem {
    district: {
        district_id: string;
        district_name: string;
    };
    ds: {
        ds_id: string;
        ds_name: string;
    };
    zone: {
        zone_id: string;
        zone_name: string;
    };
    gnd: {
        gnd_id: string;
        gnd_name: string;
    };
    mainProgram: 'NP' | 'ADB' | 'WB';
    projectOwnerName: string;
    demographics: {
        totalFamilyMembers: number;
        totalMale: number;
        totalFemale: number;
        ageRanges: {
            below16: {
                male: number;
                female: number;
                total: number;
            };
            age16To24: {
                male: number;
                female: number;
                total: number;
            };
            age25To45: {
                male: number;
                female: number;
                total: number;
            };
            age46To60: {
                male: number;
                female: number;
                total: number;
            };
            above60: {
                male: number;
                female: number;
                total: number;
            };
        };
    };
    beneficiaryType?: {
        beneficiary_type_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };
}

// Filter interface for family demographics
export interface FamilyDemographicsFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    beneficiary_type_id?: string;
    minAge?: number;
    maxAge?: number;
    specificAgeRanges?: ('below16' | '16To24' | '25To45' | '46To60' | 'above60')[];
}

// Beneficiary Type interface
export interface BeneficiaryType {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    createdBy: {
        id: string;
        name: string;
        username: string;
        language: string;
        locationCode: string;
        role: {
            id: string;
            name: string;
            canAdd: boolean;
            canUpdate: boolean;
            canDelete: boolean;
        };
    };
    createdAt: string;
}

// AccessibleLocations interface
export interface AccessibleLocations {
    districts: {
        district_id: number;
        district_name: string;
        province_id?: string;
    }[];
    dss: {
        ds_id: number;
        ds_name: string;
        district_id?: string;
    }[];
    zones: {
        zone_id: number;
        zone_name: string;
        ds_id?: string;
    }[];
    gndDivisions: {
        gnd_id: string;
        gnd_name: string;
        zone_id?: string;
    }[];
}

// Decode JWT token to get user details
export const getUserDetailsFromToken = async () => {
    if (typeof window === 'undefined') return null;

    const staffToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('staffAccessToken='))
        ?.split('=')[1];

    if (staffToken) {
        try {
            const payloadBase64 = staffToken.split('.')[1];
            const paddedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(paddedPayload));
            return {
                userId: payload.sub,
                username: payload.username,
                locationCode: payload.locationCode,
                roleName: payload.roleName,
                roleCanAdd: payload.roleCanAdd,
                roleCanUpdate: payload.roleCanUpdate,
                roleCanDelete: payload.roleCanDelete,
            };
        } catch (e) {
            console.error("Error decoding staff token", e);
        }
    }
    return null;
};

// Get accessible locations based on user role and location
export const getAccessibleLocations = async (): Promise<AccessibleLocations> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get('/samurdhi-family/accessible-locations', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch accessible locations:', error);
        throw new Error('Failed to fetch accessible locations');
    }
};

// Get beneficiary types
export const getBeneficiaryTypes = async (): Promise<BeneficiaryType[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get('/beneficiary-status', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch beneficiary types:', error);
        throw new Error('Failed to fetch beneficiary types');
    }
};

// Get family demographics data with filters
export const getFamilyDemographics = async (filters?: FamilyDemographicsFilters): Promise<FamilyDemographicsItem[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters?.district_id) queryParams.append('district_id', filters.district_id);
        if (filters?.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters?.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters?.gnd_id) queryParams.append('gnd_id', filters.gnd_id);
        if (filters?.mainProgram) queryParams.append('mainProgram', filters.mainProgram);
        if (filters?.beneficiary_type_id) queryParams.append('beneficiary_type_id', filters.beneficiary_type_id);
        if (filters?.minAge) queryParams.append('minAge', filters.minAge.toString());
        if (filters?.maxAge) queryParams.append('maxAge', filters.maxAge.toString());

        const queryString = queryParams.toString();
        const url = `/beneficiaries/demographics${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch family demographics:', error);
        throw new Error('Failed to fetch family demographics');
    }
};