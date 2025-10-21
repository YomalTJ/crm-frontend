// app/api/business-empowerment/summary/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
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

        // Get query parameters from the request
        const { searchParams } = new URL(request.url);
        const district_id = searchParams.get('district_id');
        const ds_id = searchParams.get('ds_id');
        const zone_id = searchParams.get('zone_id');
        const gnd_id = searchParams.get('gnd_id');
        const mainProgram = searchParams.get('mainProgram');
        const beneficiary_type_id = searchParams.get('beneficiary_type_id');

        // Build query parameters for the backend API
        const queryParams = new URLSearchParams();
        if (district_id) queryParams.append('district_id', district_id);
        if (ds_id) queryParams.append('ds_id', ds_id);
        if (zone_id) queryParams.append('zone_id', zone_id);
        if (gnd_id) queryParams.append('gnd_id', gnd_id);
        if (mainProgram) queryParams.append('mainProgram', mainProgram);
        if (beneficiary_type_id) queryParams.append('beneficiary_type_id', beneficiary_type_id);

        const queryString = queryParams.toString();
        const url = `/business-empowerment/summary${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error in business-empowerment/summary API:', error);
        return NextResponse.json(
            { error: error?.response?.data?.error || error?.response?.data?.message || "Failed to fetch business empowerment summary" },
            { status: error?.response?.status || 500 }
        );
    }
}