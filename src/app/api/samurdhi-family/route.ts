import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios'; // ✅ Import AxiosError

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get('authorization');

        const response = await axiosInstance.post('/samurdhi-family', body, {
            headers: {
                Authorization: authHeader || ''
            }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to create Samurdhi family record' },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: 'An unknown error occurred while creating Samurdhi family record' },
            { status: 500 }
        );
    }
}
