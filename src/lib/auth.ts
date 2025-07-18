import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function getCurrentUser(): Promise<{ sub: string; username: string; role: string; } | null> {
    const token = (await cookies()).get('accessToken')?.value;
    if (!token) return null;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            sub: string;
            username: string;
            role: string;
        };
        return payload;
    } catch {
        return null;
    }
}