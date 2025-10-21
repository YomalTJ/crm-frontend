/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from 'next/headers';

export interface FundInvestmentSummary {
    beneficiaryName: string;
    governmentContribution: number;
    beneficiaryContribution: number;
    bankLoan: number;
    otherOrganizationContribution: number;
    total: number;
    nic: string;
    hhNumber?: string;
    mainProgram?: string;
    beneficiaryType?: string;
}

export interface FundInvestmentFilters {
    district_id?: string;
    ds_id?: string;
    zone_id?: string;
    gnd_id?: string;
    mainProgram?: 'NP' | 'ADB' | 'WB';
    beneficiary_type_id?: string;
}

// Get fund investment summary data with filters
export const getFundInvestmentSummary = async (filters?: FundInvestmentFilters): Promise<FundInvestmentSummary[]> => {
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
        const url = `${baseUrl}/api/business-empowerment/summary${queryString ? `?${queryString}` : ''}`;

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
            throw new Error(error.error || 'Failed to fetch fund investment summary');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch fund investment summary:', error);
        throw new Error(error.message || 'Failed to fetch fund investment summary');
    }
};

// Get user default location for fund investment
export const getUserDefaultLocationForFundInvestment = async (): Promise<FundInvestmentFilters> => {
    try {
        const locations = await getAccessibleLocations();
        const filters: FundInvestmentFilters = {};

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

// Reuse existing function from projectOwnersService
const getAccessibleLocations = async () => {
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