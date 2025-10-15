/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from 'next/headers';

// Owner Demographics Response Interface
export interface OwnerDemographicsItem {
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
    projectOwnerAge: number;
    projectOwnerGender: string;
    disability?: {
        disability_id: number;
        nameEN: string;
        nameSi: string;
        nameTa: string;
    };
    beneficiaryType?: {
        beneficiary_type_id: string;
        nameEnglish: string;
        nameSinhala: string;
        nameTamil: string;
    };
}

// Filter interface for owner demographics
export interface OwnerDemographicsFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    beneficiary_type_id?: string;
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

// Updated AccessibleLocations interface to match backend response
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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/samurdhi-family/accessible-locations`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch accessible locations');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch accessible locations:', error);
        throw new Error(error.message || 'Failed to fetch accessible locations');
    }
};

// Get beneficiary types
export const getBeneficiaryTypes = async (): Promise<BeneficiaryType[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/beneficiary-status`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch beneficiary types');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch beneficiary types:', error);
        throw new Error(error.message || 'Failed to fetch beneficiary types');
    }
};

// Get owner demographics data with filters
export const getOwnerDemographics = async (filters?: OwnerDemographicsFilters): Promise<OwnerDemographicsItem[]> => {
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

        const queryString = queryParams.toString();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const url = `${baseUrl}/api/beneficiaries/demographics${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch owner demographics');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch owner demographics:', error);
        throw new Error(error.message || 'Failed to fetch owner demographics');
    }
};

// Add this function to ownerDemographicsService.ts
export const getUserDefaultLocation = async (): Promise<OwnerDemographicsFilters> => {
    try {
        const locations = await getAccessibleLocations();
        const filters: OwnerDemographicsFilters = {};

        // If user has access to only one location at each level, use that as default
        if (locations.districts.length === 1) {
            filters.district_id = locations.districts[0].district_id.toString();
        }
        if (locations.dss.length === 1) {
            filters.ds_id = locations.dss[0].ds_id.toString();
        }
        if (locations.zones.length === 1) {
            filters.zone_id = locations.zones[0].zone_id.toString();
        }
        if (locations.gndDivisions.length === 1) {
            filters.gnd_id = locations.gndDivisions[0].gnd_id;
        }

        return filters;
    } catch (error) {
        console.error('Failed to get user default location:', error);
        return {};
    }
};