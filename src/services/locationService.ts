'use server'

import axiosInstance from "@/lib/axios";
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

        const response = await axiosInstance.get('/location/provinces', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        throw new Error('Failed to fetch provinces');
    }
};

export const getDistrictsByProvince = async (provinceId: string): Promise<District[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/location/districts/${provinceId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch districts:', error);
        throw new Error('Failed to fetch districts');
    }
};

export const getDSDivisionsByDistrict = async (districtId: string): Promise<DSDivision[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/location/ds/${districtId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch DS divisions:', error);
        throw new Error('Failed to fetch DS divisions');
    }
};

export const getZonesByDSDivision = async (dsId: string): Promise<Zone[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/location/zones/${dsId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch zones:', error);
        throw new Error('Failed to fetch zones');
    }
};

export const getGNDsByZone = async (zoneId: string): Promise<GND[]> => {
    try {
        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.get(`/location/gnd/${zoneId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch GNDs:', error);
        throw new Error('Failed to fetch GNDs');
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

        const params = new URLSearchParams();
        if (districtId) params.append('districtId', districtId);
        if (dsId) params.append('dsId', dsId);
        if (zoneId) params.append('zoneId', zoneId);

        const queryString = params.toString();
        const url = `/location${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch location hierarchy:', error);
        throw new Error('Failed to fetch location hierarchy');
    }
};