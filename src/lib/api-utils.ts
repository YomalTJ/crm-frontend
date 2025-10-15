/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";

// Get the base URL for API calls
export const getBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

// Get authentication token from cookies
export const getAuthToken = async (): Promise<string> => {
    const { cookies } = await import('next/headers');
    const token =
        (await cookies()).get('accessToken')?.value ||
        (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    return token;
};

// Get staff authentication token specifically
export const getStaffAuthToken = async (): Promise<string> => {
    const { cookies } = await import('next/headers');
    const token = (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
        throw new Error('No staff authentication token found');
    }

    return token;
};

// Handle API response with consistent error handling
export const handleApiResponse = async (response: Response): Promise<any> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'API request failed');
    }
    return await response.json();
};

// Common headers for API requests
export const getApiHeaders = async (contentType: string = 'application/json'): Promise<HeadersInit> => {
    const token = await getAuthToken();
    const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
    };

    if (contentType !== 'multipart/form-data') {
        headers['Content-Type'] = contentType;
    }

    return headers;
};

// Common headers for staff API requests
export const getStaffApiHeaders = async (contentType: string = 'application/json'): Promise<HeadersInit> => {
    const token = await getStaffAuthToken();
    const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
    };

    if (contentType !== 'multipart/form-data') {
        headers['Content-Type'] = contentType;
    }

    return headers;
};

// Decode JWT token to get user details
export const getUserDetailsFromToken = async () => {
    if (typeof window === 'undefined') return null;

    const staffToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('staffAccessToken='))
        ?.split('=')[1];

    if (staffToken) {
        try {
            const payloadBase64 = staffToken.split('.')[1];
            const paddedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(paddedPayload));
            return {
                userId: payload.sub,
                username: payload.username,
                locationCode: payload.locationCode,
                roleName: payload.roleName,
                roleCanAdd: payload.roleCanAdd,
                roleCanUpdate: payload.roleCanUpdate,
                roleCanDelete: payload.roleCanDelete,
            };
        } catch (e) {
            console.error("Error decoding staff token", e);
        }
    }
    return null;
};

export const validateAppKey = (request: Request): NextResponse | null => {
    const appKey = request.headers.get("x-app-key");
    const expectedAppKey = process.env.APP_AUTH_KEY;

    console.log("🔐 APP_KEY VALIDATION:", {
        received: appKey ? `"${appKey}"` : 'MISSING',
        expected: expectedAppKey ? `"${expectedAppKey}"` : 'NOT_SET_IN_ENV',
        isValid: appKey === expectedAppKey
    });

    if (!appKey) {
        return NextResponse.json(
            { error: "Missing Application Key - x-app-key header required" },
            { status: 401 }
        );
    }

    if (appKey !== expectedAppKey) {
        return NextResponse.json(
            { error: "Invalid Application Key" },
            { status: 401 }
        );
    }

    return null;
};