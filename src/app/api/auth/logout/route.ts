import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    const adminToken = (await cookieStore).get('accessToken')?.value;
    const staffToken = (await cookieStore).get('staffAccessToken')?.value;

    let token = '';
    let apiPath = '';

    if (adminToken) {
      token = adminToken;
      apiPath = '/auth/logout';
    } else if (staffToken) {
      token = staffToken;
      apiPath = '/staff/logout';
    } else {
      // No token, just clear both cookies
      const res = NextResponse.json({ message: 'Logged out successfully' });
      res.headers.set(
        'Set-Cookie',
        `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
      );
      res.headers.append(
        'Set-Cookie',
        `staffAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
      );
      return res;
    }

    // Call backend logout API
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-app-key': process.env.NEXT_PUBLIC_APP_AUTH_KEY || '',
      },
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to invalidate token on backend');
    }

    const res = NextResponse.json({ message: 'Logged out successfully' });

    if (adminToken) {
      res.headers.set(
        'Set-Cookie',
        `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
      );
    }
    if (staffToken) {
      res.headers.append(
        'Set-Cookie',
        `staffAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
      );
    }

    return res;
  } catch (error: unknown) {
    console.error('Logout error:', error);

    let message = 'Logout failed';
    if (error instanceof Error) message = error.message;

    return NextResponse.json({ message }, { status: 500 });
  }
}
