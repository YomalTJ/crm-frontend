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

        const gnCode = searchParams.get('gnCode');
        const hhReference = searchParams.get('hhReference');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization header is required' },
                { status: 401 }
            );
        }

        let response;

        if (gnCode) {
            // Get household numbers by GN code
            response = await axios.get(`${API_BASE_URL}/household-citizen/by-gn-code/${gnCode}`, {
                headers: {
                    Authorization: authHeader,
                    'x-app-key': process.env.APP_AUTH_KEY!

                }
            });
        } else if (hhReference) {
            // Get household details by reference
            response = await axios.get(`${API_BASE_URL}/household-citizen/${hhReference}`, {
                headers: {
                    Authorization: authHeader,
                    'x-app-key': process.env.APP_AUTH_KEY!

                }
            });
        } else {
            return NextResponse.json(
                { error: 'Either gnCode or hhReference parameter is required' },
                { status: 400 }
            );
        }

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to fetch household data' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred while fetching household data' },
            { status: 500 }
        );
    }
}