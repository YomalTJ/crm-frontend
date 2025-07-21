import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        
        // Forward the request with the auth header
        const response = await axiosInstance.get('/current-employment', {
            headers: {
                Authorization: authHeader || ''
            }
        });
        
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.message || 'Failed to fetch current employment options' },
            { status: error.response?.status || 500 }
        );
    }
}