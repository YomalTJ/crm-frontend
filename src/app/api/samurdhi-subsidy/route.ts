import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios'; // 👈 import this

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');

        const response = await axiosInstance.get('/samurdhi-subsidy', {
            headers: {
                Authorization: authHeader || ''
            }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to fetch Samurdhi subsidy options' },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: 'An unknown error occurred while fetching Samurdhi subsidy options' },
            { status: 500 }
        );
    }
}
