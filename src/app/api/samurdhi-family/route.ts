/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Forward the request to your backend API
        const response = await axiosInstance.post('/samurdhi-family', body);
        
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.message || 'Failed to create Samurdhi family record' },
            { status: error.response?.status || 500 }
        );
    }
}