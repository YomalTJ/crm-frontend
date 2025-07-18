/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get('authorization');
        
        // Forward the request with the auth header
        const response = await axiosInstance.post('/samurdhi-family', body, {
            headers: {
                Authorization: authHeader || ''
            }
        });
        
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.message || 'Failed to create Samurdhi family record' },
            { status: error.response?.status || 500 }
        );
    }
}