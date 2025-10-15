/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateAppKey } from "@/lib/api-utils";
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url);
        const nic = searchParams.get('nic');
        const hh = searchParams.get('hh');

        let url = '/beneficiary-training';

        // Build search URL if parameters provided
        if (nic || hh) {
            const params = new URLSearchParams();
            if (nic) params.append('nic', nic);
            if (hh) params.append('hh', hh);
            url = `/beneficiary-training/search/by-identifier?${params}`;
        }

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch beneficiary training data" },
            { status: error?.response?.status || 500 }
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

        const payload = await request.json();

        const response = await axiosInstance.post('/beneficiary-training', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to create beneficiary training record" },
            { status: error?.response?.status || 500 }
        );
    }
}

export async function PUT(request: Request) {
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

        const { searchParams } = new URL(request.url);
        const nic = searchParams.get('nic');
        const hh = searchParams.get('hh');

        if (!nic && !hh) {
            return NextResponse.json({ error: "NIC or HH number is required for update" }, { status: 400 });
        }

        const payload = await request.json();

        const params = new URLSearchParams();
        if (nic) params.append('nic', nic);
        if (hh) params.append('hh', hh);

        const response = await axiosInstance.put(`/beneficiary-training/update/by-identifier?${params}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-app-key": process.env.APP_AUTH_KEY
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to update beneficiary training records" },
            { status: error?.response?.status || 500 }
        );
    }
}