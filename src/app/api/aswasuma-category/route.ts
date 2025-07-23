import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');

        const response = await axiosInstance.get('/aswasuma-category', {
            headers: {
                Authorization: authHeader || ''
            }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        // Narrow the error to check if it's an AxiosError
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as {
                response?: {
                    data?: { message?: string };
                    status?: number;
                };
            };

            return NextResponse.json(
                { error: axiosError.response?.data?.message || 'Failed to fetch Aswasuma categories' },
                { status: axiosError.response?.status || 500 }
            );
        }

        // Fallback for unknown errors
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 }
        );
    }
}
