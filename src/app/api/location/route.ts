/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from 'next/headers';

export interface Province {
    province_id: number;
    id: string;
    province_name: string;
    status: boolean;
}

export interface District {
    district_id: string;
    province_id: string;
    id: string;
    district_name: string;
    status: boolean;
}

export interface DSDivision {
    ds_id: string;
    district_id: string;
    id: string;
    ds_name: string;
    status: boolean;
}

export interface Zone {
    zone_id: string;
    ds_id: string;
    id: string;
    zone_name: string;
    status: boolean;
}

export interface GND {
    gnd_id: string;
    zone_id: string;
    id: string;
    gnd_name: string;
    status: boolean;
}

export interface LocationResponseDto {
    districts?: {
        id: string;
        name: string;
    }[];
    dss?: {
        id: string;
        name: string;
        districtId: string;
    }[];
    zones?: {
        id: string;
        name: string;
        dsId: string;
    }[];
    gnds?: {
        id: string;
        name: string;
        zoneId: string;
    }[];
}

export const getProvinces = async (): Promise<Province[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/location/provinces`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch provinces');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch provinces');
    }
};

export const getDistrictsByProvince = async (provinceId: string): Promise<District[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/location/districts/${provinceId}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch districts');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch districts');
    }
};

export const getDSDivisionsByDistrict = async (districtId: string): Promise<DSDivision[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/location/ds/${districtId}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch DS divisions');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch DS divisions');
    }
};

export const getZonesByDSDivision = async (dsId: string): Promise<Zone[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/location/zones/${dsId}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch zones');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch zones');
    }
};

export const getGNDsByZone = async (zoneId: string): Promise<GND[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/location/gnd/${zoneId}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch GNDs');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch GNDs');
    }
};

export const getLocationHierarchy = async (
    districtId?: string,
    dsId?: string,
    zoneId?: string
): Promise<LocationResponseDto> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const params = new URLSearchParams();
        if (districtId) params.append('districtId', districtId);
        if (dsId) params.append('dsId', dsId);
        if (zoneId) params.append('zoneId', zoneId);

        const queryString = params.toString();
        const url = `${baseUrl}/api/location${queryString ? `?${queryString}` : ''}`;

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
            throw new Error(error.error || 'Failed to fetch location hierarchy');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch location hierarchy');
    }
};