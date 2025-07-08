import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Remove the accessToken cookie
  (await cookies()).delete('accessToken');

  return NextResponse.json({ message: 'Logged out successfully' });
}
