/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const cookieToken = (await cookies()).get("accessToken")?.value || (await cookies()).get("staffAccessToken")?.value;
        const authHeader = request.headers.get("authorization");
        const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const token = cookieToken || headerToken;

        if (!token) {
            return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const response = await axiosInstance.get("/samurdhi-family/count-report", {
            params: Object.fromEntries(searchParams),
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to fetch samurdhi family count with locations" },
            { status: error?.response?.status || 500 }
        );
    }
}