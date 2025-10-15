/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateAppKey } from "@/lib/api-utils";
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const response = await axiosInstance.get(`/grant-utilization/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch grant utilization details" },
            { status: error?.response?.status || 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const response = await axiosInstance.put(`/grant-utilization/${params.id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "x-app-key": process.env.APP_AUTH_KEY
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to update grant utilization record" },
            { status: error?.response?.status || 500 }
        );
    }
}