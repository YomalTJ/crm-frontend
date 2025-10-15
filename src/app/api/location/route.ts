/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/location/route.ts
import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const districtId = searchParams.get('districtId');
        const dsId = searchParams.get('dsId');
        const zoneId = searchParams.get('zoneId');

        const token = (await cookies()).get('staffAccessToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
        }

        // Build query parameters for the backend API
        const params = new URLSearchParams();
        if (districtId) params.append('districtId', districtId);
        if (dsId) params.append('dsId', dsId);
        if (zoneId) params.append('zoneId', zoneId);

        const queryString = params.toString();

        // Call your actual backend API
        const response = await axiosInstance.get(`/location${queryString ? `?${queryString}` : ''}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || 'Failed to fetch location hierarchy' },
            { status: error?.response?.status || 500 }
        );
    }
}