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
        const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const token = cookieToken || headerToken;

        if (!token) {
            return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const response = await axiosInstance.get("/beneficiaries/empowerment-refusals", {
            params: Object.fromEntries(searchParams),
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch refusal reasons" },
            { status: error?.response?.status || 500 }
        );
    }
}