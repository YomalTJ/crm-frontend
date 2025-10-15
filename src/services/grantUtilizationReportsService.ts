/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from 'next/headers';

// Grant Utilization Response Interface
export interface GrantUtilizationData {
    location?: {
        district?: {
            district_id: string;
            district_name: string;
        };
        ds?: {
            ds_id: string;
            ds_name: string;
        };
        zone?: {
            zone_id: string;
            zone_name: string;
        };
        gnd?: {
            gnd_id: string;
            gnd_name: string;
        };
    };
    financialAid: {
        totalProjects: number;
        totalAmount: number;
    };
    interestSubsidizedLoan: {
        totalProjects: number;
        totalAmount: number;
    };
    samurdiBankLoan: {
        totalProjects: number;
        totalAmount: number;
    };
    overallTotal: {
        totalProjects: number;
        totalAmount: number;
    };
}

// Filter interface for grant utilization
export interface GrantUtilizationFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    beneficiary_type_id?: string;
}

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

// AccessibleLocations interface (reused from area types)
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

// Decode JWT token to get user details (server-side only)
export const getUserDetailsFromToken = async () => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            return null;
        }

        const payloadBase64 = token.split('.')[1];
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
    } catch (error) {
        console.error("Error decoding staff token", error);
        return null;
    }
};

// Use existing API routes
export const getBeneficiaryTypes = async (): Promise<BeneficiaryType[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Use existing beneficiary-status API route
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
        throw new Error(error.message || 'Failed to fetch beneficiary types');
    }
};

// Get accessible locations based on user role and location
export const getAccessibleLocations = async (): Promise<AccessibleLocations> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Use existing accessible-locations API route from dashboard
        const response = await fetch(`${baseUrl}/api/dashboard/accessible-locations`, {
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
        throw new Error(error.message || 'Failed to fetch accessible locations');
    }
};

// Get grant utilization data with filters
export const getGrantUtilization = async (filters?: GrantUtilizationFilters): Promise<GrantUtilizationData> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters?.district_id) queryParams.append('district_id', filters.district_id);
        if (filters?.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters?.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters?.gnd_id) queryParams.append('gnd_id', filters.gnd_id);
        if (filters?.mainProgram) queryParams.append('mainProgram', filters.mainProgram);
        if (filters?.beneficiary_type_id) queryParams.append('beneficiary_type_id', filters.beneficiary_type_id);

        const queryString = queryParams.toString();

        // Use a generic API route or create a specific one for grant utilization
        // For now, using the beneficiaries API pattern
        const url = `${baseUrl}/api/beneficiaries/grant-utilization${queryString ? `?${queryString}` : ''}`;

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
            throw new Error(error.error || 'Failed to fetch grant utilization data');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch grant utilization data');
    }
};

export const getUserDefaultLocation = async (): Promise<GrantUtilizationFilters> => {
    try {
        const locations = await getAccessibleLocations();
        const filters: GrantUtilizationFilters = {};

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