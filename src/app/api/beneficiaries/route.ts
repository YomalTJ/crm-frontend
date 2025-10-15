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

        const cookieToken = (await cookies()).get("staffAccessToken")?.value;

        const authHeader = request.headers.get("authorization");
        const headerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = cookieToken || headerToken;

        if (!token) {
            return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Build query parameters
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const mainProgram = searchParams.get('mainProgram');
        const beneficiaryType = searchParams.get('beneficiaryType');
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        const search = searchParams.get('search');

        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (mainProgram) params.append('mainProgram', mainProgram);
        if (beneficiaryType) params.append('beneficiaryType', beneficiaryType);
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        if (search) params.append('search', search);

        const queryString = params.toString();
        const url = `/samurdhi-family/created-by-me${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch beneficiaries" },
            { status: error?.response?.status || 500 }
        );
    }
}