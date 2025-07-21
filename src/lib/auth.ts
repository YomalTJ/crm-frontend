import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function getCurrentUser(): Promise<{ sub: string; username: string; role: string; } | null> {
    const cookieStore = cookies();
    const adminToken = (await cookieStore).get('accessToken')?.value;
    const staffToken = (await cookieStore).get('staffAccessToken')?.value;

    try {
        if (adminToken) {
            const adminPayload = jwt.verify(adminToken, process.env.JWT_SECRET!) as {
                sub: string;
                username: string;
                role: string;
            };
            return { ...adminPayload, role: 'admin' };
        }

        if (staffToken) {
            const staffPayload = jwt.verify(staffToken, process.env.JWT_SECRET!) as {
                sub: string;
                username: string;
                role: string;
            };
            return { ...staffPayload, role: 'staff' };
        }

        return null;
    } catch {
        return null;
    }
}
