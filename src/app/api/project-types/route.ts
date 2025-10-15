import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';
import { validateAppKey } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
    try {
        const appKeyValidation = validateAppKey(req);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const authHeader = req.headers.get('authorization');
        const { searchParams } = new URL(req.url);
        const livelihoodId = searchParams.get('livelihoodId');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization header is required' },
                { status: 401 }
            );
        }

        if (!livelihoodId) {
            return NextResponse.json(
                { error: 'livelihoodId parameter is required' },
                { status: 400 }
            );
        }

        const response = await axios.get(`${API_BASE_URL}/project-type/livelihood/${livelihoodId}`, {
            headers: {
                Authorization: authHeader,
                'x-app-key': process.env.APP_AUTH_KEY!

            }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to fetch project types' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred while fetching project types' },
            { status: 500 }
        );
    }
}