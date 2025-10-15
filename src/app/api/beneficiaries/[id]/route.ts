/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateAppKey } from "@/lib/api-utils";
import axiosInstance from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await the params to resolve the Promise
        const resolvedParams = await params;
        const id = resolvedParams.id;

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

        await axiosInstance.delete(`/samurdhi-family/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return NextResponse.json({ message: "Beneficiary deleted successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || "Failed to delete beneficiary" },
            { status: error?.response?.status || 500 }
        );
    }
}