/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ nic: string }> }
) {
    try {
        // Await the params first
        const { nic } = await params;

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

        const response = await axiosInstance.get(`/business-empowerment/nic/${nic}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        if (error?.response?.status === 404) {
            return NextResponse.json(null);
        }
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch business empowerment data" },
            { status: error?.response?.status || 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ nic: string }> } // params is now a Promise
) {
    try {
        // Await the params first
        const { nic } = await params;

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

        const response = await axiosInstance.put(`/business-empowerment/nic/${nic}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-app-key": process.env.APP_AUTH_KEY
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to update business empowerment record" },
            { status: error?.response?.status || 500 }
        );
    }
}