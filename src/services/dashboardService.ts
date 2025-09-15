'use server'

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

// Dashboard Data Interfaces
export interface ProgramCountDto {
    mainProgram: string;
    count: number;
}

export interface YearlyProgramCountDto {
    year: number;
    programs: ProgramCountDto[];
}

export interface BeneficiaryTypeCountDto {
    beneficiary_type_id: string;
    nameEnglish: string;
    nameSinhala: string;
    nameTamil: string;
    count: number;
}

export interface BeneficiaryTypeCountResponseDto {
    counts: BeneficiaryTypeCountDto[];
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
}

export interface BeneficiaryTypeCountFilterDto {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
}

export interface BeneficiaryCountResponseDto {
    data: YearlyProgramCountDto[];
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
}

export interface BeneficiaryCountFilterDto {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    years?: number[];
}

// User Details Interface
export interface UserDetails {
    userId: string;
    username: string;
    locationCode: string;
    roleName: string;
    roleCanAdd: boolean;
    roleCanUpdate: boolean;
    roleCanDelete: boolean;
}

// Accessible Locations Interface
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
export const getUserDetailsFromToken = async (): Promise<UserDetails | null> => {
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

// Get beneficiary count by year with filtering based on user's accessible locations
export const getBeneficiaryCountByYear = async (additionalFilters?: Partial<BeneficiaryCountFilterDto>): Promise<BeneficiaryCountResponseDto> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Get user's accessible locations to apply automatic filtering
        const accessibleLocations = await getAccessibleLocations();
        const filters: BeneficiaryCountFilterDto = { ...additionalFilters };

        // Apply location-based filtering based on user's access level
        if (accessibleLocations.districts.length === 1) {
            filters.district_id = accessibleLocations.districts[0].district_id.toString();
        }
        if (accessibleLocations.dss.length === 1) {
            filters.ds_id = accessibleLocations.dss[0].ds_id.toString();
        }
        if (accessibleLocations.zones.length === 1) {
            filters.zone_id = accessibleLocations.zones[0].zone_id.toString();
        }
        if (accessibleLocations.gndDivisions.length === 1) {
            filters.gnd_id = accessibleLocations.gndDivisions[0].gnd_id;
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.district_id) queryParams.append('district_id', filters.district_id);
        if (filters.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters.gnd_id) queryParams.append('gnd_id', filters.gnd_id);
        if (filters.mainProgram) queryParams.append('mainProgram', filters.mainProgram);
        if (filters.years && filters.years.length > 0) {
            filters.years.forEach(year => queryParams.append('years', year.toString()));
        }

        const queryString = queryParams.toString();
        const url = `/beneficiaries/count-by-year${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch beneficiary count by year:', error);
        throw new Error('Failed to fetch beneficiary count data');
    }
};

// Get default filters based on user's role and accessible locations
export const getUserDefaultFilters = async (): Promise<BeneficiaryCountFilterDto> => {
    try {
        const accessibleLocations = await getAccessibleLocations();
        const filters: BeneficiaryCountFilterDto = {};

        // Apply default location filters based on user's access level
        if (accessibleLocations.districts.length === 1) {
            filters.district_id = accessibleLocations.districts[0].district_id.toString();
        }
        if (accessibleLocations.dss.length === 1) {
            filters.ds_id = accessibleLocations.dss[0].ds_id.toString();
        }
        if (accessibleLocations.zones.length === 1) {
            filters.zone_id = accessibleLocations.zones[0].zone_id.toString();
        }
        if (accessibleLocations.gndDivisions.length === 1) {
            filters.gnd_id = accessibleLocations.gndDivisions[0].gnd_id;
        }

        // Default to current and next years
        filters.years = [2025, 2026, 2027];

        return filters;
    } catch (error) {
        console.error('Failed to get user default filters:', error);
        return { years: [2025, 2026, 2027] };
    }
};

// Get location display name based on user's access level
export const getLocationDisplayName = async (): Promise<string> => {
    try {
        const accessibleLocations = await getAccessibleLocations();
        const userDetails = await getUserDetailsFromToken();

        if (!userDetails) return 'Unknown Location';

        // Return location name based on access level
        if (accessibleLocations.gndDivisions.length === 1) {
            return `GND: ${accessibleLocations.gndDivisions[0].gnd_name}`;
        }
        if (accessibleLocations.zones.length === 1) {
            return `Zone: ${accessibleLocations.zones[0].zone_name}`;
        }
        if (accessibleLocations.dss.length === 1) {
            return `DS Division: ${accessibleLocations.dss[0].ds_name}`;
        }
        if (accessibleLocations.districts.length === 1) {
            return `District: ${accessibleLocations.districts[0].district_name}`;
        }

        return 'National Level';
    } catch (error) {
        console.error('Failed to get location display name:', error);
        return 'Unknown Location';
    }
};

export const getBeneficiaryTypeCounts = async (additionalFilters?: Partial<BeneficiaryTypeCountFilterDto>): Promise<BeneficiaryTypeCountResponseDto> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Get user's accessible locations to apply automatic filtering
        const accessibleLocations = await getAccessibleLocations();
        const filters: BeneficiaryTypeCountFilterDto = { ...additionalFilters };

        // Apply location-based filtering based on user's access level
        if (accessibleLocations.districts.length === 1) {
            filters.district_id = accessibleLocations.districts[0].district_id.toString();
        }
        if (accessibleLocations.dss.length === 1) {
            filters.ds_id = accessibleLocations.dss[0].ds_id.toString();
        }
        if (accessibleLocations.zones.length === 1) {
            filters.zone_id = accessibleLocations.zones[0].zone_id.toString();
        }
        if (accessibleLocations.gndDivisions.length === 1) {
            filters.gnd_id = accessibleLocations.gndDivisions[0].gnd_id;
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.district_id) queryParams.append('district_id', filters.district_id);
        if (filters.ds_id) queryParams.append('ds_id', filters.ds_id);
        if (filters.zone_id) queryParams.append('zone_id', filters.zone_id);
        if (filters.gnd_id) queryParams.append('gnd_id', filters.gnd_id);

        const queryString = queryParams.toString();
        const url = `/beneficiaries/type-counts${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch beneficiary type counts:', error);
        throw new Error('Failed to fetch beneficiary type counts');
    }
};