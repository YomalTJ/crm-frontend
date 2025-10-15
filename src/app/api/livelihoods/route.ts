/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { cookies } from 'next/headers';
import { validateAppKey } from '@/lib/api-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
    try {
        const appKeyValidation = validateAppKey(req);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const authHeader = req.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization header is required' },
                { status: 401 }
            );
        }

        const response = await axiosInstance.get(`${API_BASE_URL}/livelihoods`, {
            headers: {
                Authorization: authHeader,
            }
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Failed to fetch livelihoods' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred while fetching livelihoods' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const appKeyValidation = validateAppKey(request);
        if (appKeyValidation) {
            return appKeyValidation;
        }

        const cookieToken =
            (await cookies()).get("accessToken")?.value ||
            (await cookies()).get("staffAccessToken")?.value;

        const authHeader = request.headers.get("authorization");
        const headerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = cookieToken || headerToken;

        if (!token) {
            return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
        }

        const data = await request.json();

        const response = await axiosInstance.post("/livelihoods", data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "x-app-key": process.env.APP_AUTH_KEY
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to create livelihood" },
            { status: error?.response?.status || 500 }
        );
    }
}