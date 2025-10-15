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

        // Build query parameters for beneficiary details
        const district_id = searchParams.get('district_id');
        const ds_id = searchParams.get('ds_id');
        const zone_id = searchParams.get('zone_id');
        const gnd_id = searchParams.get('gnd_id');
        const mainProgram = searchParams.get('mainProgram');
        const empowerment_dimension_id = searchParams.get('empowerment_dimension_id');

        const queryParams = new URLSearchParams();
        if (district_id) queryParams.append('district_id', district_id);
        if (ds_id) queryParams.append('ds_id', ds_id);
        if (zone_id) queryParams.append('zone_id', zone_id);
        if (gnd_id) queryParams.append('gnd_id', gnd_id);
        if (mainProgram) queryParams.append('mainProgram', mainProgram);
        if (empowerment_dimension_id) queryParams.append('empowerment_dimension_id', empowerment_dimension_id);

        const queryString = queryParams.toString();
        const url = `/beneficiaries/details${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch beneficiary details" },
            { status: error?.response?.status || 500 }
        );
    }
}