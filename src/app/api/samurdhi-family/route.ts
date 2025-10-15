import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';
import { validateAppKey } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const APP_AUTH_KEY = process.env.APP_AUTH_KEY;

export async function POST(req: NextRequest) {
    try {
        const appKeyValidation = validateAppKey(req);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const authHeader = req.headers.get('authorization');
        const contentType = req.headers.get('content-type');

        if (contentType?.includes('multipart/form-data')) {
            const formData = await req.formData();
            const response = await axios.post(`${API_BASE_URL}/samurdhi-family`, formData, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'multipart/form-data',
                }
            });
            return NextResponse.json(response.data);
        } else {
            const body = await req.json();
            const response = await axios.post(`${API_BASE_URL}/samurdhi-family`, body, {
                headers: {
                    Authorization: authHeader || '',
                    'Content-Type': 'application/json',
                }
            });
            return NextResponse.json(response.data);
        }
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

export async function GET(req: NextRequest) {
    try {
        const appKeyValidation = validateAppKey(req);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const authHeader = req.headers.get('authorization');
        const { searchParams } = new URL(req.url);

        const checkExists = searchParams.get('checkExists');
        const type = searchParams.get('type');
        const identifier = searchParams.get('identifier');

        let response;

        if (checkExists && type && identifier) {
            // Check existence endpoint
            response = await axios.get(`${API_BASE_URL}/samurdhi-family/check-exists?${type}=${encodeURIComponent(identifier)}`, {
                headers: {
                    Authorization: authHeader || '',
                    'x-app-key': APP_AUTH_KEY || ''
                }
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid parameters' },
                { status: 400 }
            );
        }

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                return NextResponse.json({ exists: false });
            }
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to check existing beneficiary' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred while checking beneficiary' },
            { status: 500 }
        );
    }
}