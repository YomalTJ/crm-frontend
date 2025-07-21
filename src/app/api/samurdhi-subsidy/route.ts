import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        
        const response = await axiosInstance.get('/samurdhi-subsidy', {
            headers: {
                Authorization: authHeader || ''
            }
        });
        
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.message || 'Failed to fetch Samurdhi subsidy options' },
            { status: error.response?.status || 500 }
        );
    }
}