import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const staffAccessToken = (await cookies()).get('staffAccessToken')?.value;

    if (staffAccessToken) {
        try {
            const payload = JSON.parse(Buffer.from(staffAccessToken.split('.')[1], 'base64').toString());
            return NextResponse.json({
                role: payload.roleName || 'staff',
                roleId: payload.roleId,
                canAdd: payload.roleCanAdd,
                canUpdate: payload.roleCanUpdate,
                canDelete: payload.roleCanDelete
            });
        } catch (e) {
            console.error("Error decoding staff token", e);
        }
    }

    return NextResponse.json({ role: null }, { status: 401 });
}