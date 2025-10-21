import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';
import { validateAppKey } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ identifier: string }> } // Change to Promise
) {
    try {
        const appKeyValidation = validateAppKey(request);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const { identifier } = await context.params; // Await the params
        const authHeader = request.headers.get('authorization');

        if (!identifier) {
            return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
        }

        const response = await axios.get(`${API_BASE_URL}/samurdhi-family/${identifier}`, {
            headers: {
                Authorization: authHeader,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to fetch beneficiary details' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred while fetching beneficiary details' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ identifier: string }> } // Change to Promise
) {
    try {
        const appKeyValidation = validateAppKey(request);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const { identifier } = await context.params; // Await the params
        const authHeader = request.headers.get('authorization');
        const contentType = request.headers.get('content-type');

        if (!identifier) {
            return NextResponse.json(
                { error: 'Identifier is required' },
                { status: 400 }
            );
        }

        let response;

        if (contentType?.includes('multipart/form-data')) {
            // Handle FormData with file upload
            const formData = await request.formData();

            response = await axios.put(`${API_BASE_URL}/samurdhi-family/${identifier}`, formData, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'multipart/form-data',
                    'x-app-key': process.env.APP_AUTH_KEY!
                }
            });
        } else {
            // Handle JSON payload
            const body = await request.json();

            response = await axios.put(`${API_BASE_URL}/samurdhi-family/${identifier}`, body, {
                headers: {
                    Authorization: authHeader || '',
                    'Content-Type': 'application/json',
                    'x-app-key': process.env.APP_AUTH_KEY!
                }
            });
        }

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                {
                    error: error.response?.data?.message || 'Failed to update Samurdhi family record'
                },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: 'An unknown error occurred while updating Samurdhi family record' },
            { status: 500 }
        );
    }
}