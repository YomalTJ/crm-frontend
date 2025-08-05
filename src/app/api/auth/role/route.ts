import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const accessToken = (await cookies()).get('accessToken')?.value;
    const staffAccessToken = (await cookies()).get('staffAccessToken')?.value;

    if (accessToken) {
        try {
            const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
            return NextResponse.json({ role: payload.role || 'user' });
        } catch (e) {
            console.error("Error decoding admin token", e);
        }
    }

    if (staffAccessToken) {
        try {
            const payload = JSON.parse(Buffer.from(staffAccessToken.split('.')[1], 'base64').toString());
            return NextResponse.json({
                role: payload.role?.name || payload.role || 'staff'
            });
        } catch (e) {
            console.error("Error decoding staff token", e);
        }
    }

    return NextResponse.json({ role: null }, { status: 401 });
}