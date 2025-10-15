/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axiosInstance from '@/lib/axios';

export async function POST() {
  try {

    const cookieStore = await cookies();
    const staffToken = cookieStore.get('staffAccessToken')?.value;
    const wbbAuthToken = cookieStore.get('wbbAuthToken')?.value;

    // 🚪 Case: Both tokens already missing → user effectively logged out
    if (!staffToken && !wbbAuthToken) {
      const res = NextResponse.json({ message: 'Logged out successfully' });
      res.headers.set(
        'Set-Cookie',
        `staffAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
      );
      res.headers.append(
        'Set-Cookie',
        `wbbAuthToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
      );
      return res;
    }

    // 🧾 Invalidate staff token in backend if it exists
    if (staffToken) {
      try {
        await axiosInstance.post(
          '/staff/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${staffToken}`,
            },
          }
        );
      } catch (axiosError: any) {
        const errorMsg = axiosError?.response?.data?.message || 'Failed to invalidate staff token on backend';
        throw new Error(errorMsg);
      }
    }

    // ✅ Clear cookies on successful logout
    const res = NextResponse.json({ message: 'Logged out successfully' });

    res.headers.set(
      'Set-Cookie',
      `staffAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
    );
    res.headers.append(
      'Set-Cookie',
      `wbbAuthToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
    );

    return res;
  } catch (error: unknown) {
    console.error('Logout error:', error);

    let message = 'Logout failed';
    if (error instanceof Error) message = error.message;

    return NextResponse.json({ message }, { status: 500 });
  }
}
