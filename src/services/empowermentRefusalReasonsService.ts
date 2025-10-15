'use server'

import { cookies } from "next/headers";

export const getEmpowermentRefusalReasons = async () => {
    try {
        const token =
            (await cookies()).get("accessToken")?.value ||
            (await cookies()).get("staffAccessToken")?.value;

        if (!token) {
            throw new Error("No authentication token found");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/empowerment-refusal-reasons`, {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
                'x-app-key': process.env.APP_AUTH_KEY!
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to fetch refusal reasons");
        }

        return await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch refusal reasons");
    }
};
