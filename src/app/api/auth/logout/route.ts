import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    const staffToken = (await cookieStore).get('staffAccessToken')?.value;
    const wbbAuthToken = (await cookieStore).get('wbbAuthToken')?.value;

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

    if (staffToken) {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${staffToken}`,
          'x-app-key': process.env.NEXT_PUBLIC_APP_AUTH_KEY || '',
        },
        credentials: 'include',
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to invalidate staff token on backend');
      }
    }

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
