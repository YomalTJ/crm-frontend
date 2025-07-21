import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get('accessToken')?.value;
    
    if (!token) {
      // If no token, still clear cookies and return success
      return NextResponse.json(
        { message: 'Logged out successfully' },
        {
          headers: {
            'Set-Cookie': `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`,
          },
        }
      );
    }

    // Call backend logout endpoint to invalidate the token
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Fixed: Always include Bearer prefix
        'x-app-key': process.env.NEXT_PUBLIC_APP_AUTH_KEY || '',
      },
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to invalidate token on backend');
    }

    // Clear the frontend cookie (Fixed: use correct cookie name)
    (await cookieStore).delete('accessToken');

    return NextResponse.json(
      { message: 'Logged out successfully' },
      {
        headers: {
          'Set-Cookie': `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`,
        },
      }
    );
  } catch (error: unknown) {
  console.error('Logout error:', error);

  let message = 'Logout failed';

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json(
    { message },
    { status: 500 }
  );
}

}