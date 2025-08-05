import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const staffAccessToken = request.cookies.get('staffAccessToken')?.value;

    // Function to decode JWT
    const decodeJWT = (token: string) => {
        try {
            const payload = Buffer.from(token.split('.')[1], 'base64').toString();
            return JSON.parse(payload);
        } catch {
            return null;
        }
    };

    // Check if user is admin
    let isAdmin = false;
    if (accessToken) {
        const payload = decodeJWT(accessToken);
        isAdmin = payload?.role === 'user'; // Admin role is 'user' in your token
    }

    // Check if user is staff
    let staffRole = null;
    if (staffAccessToken) {
        const payload = decodeJWT(staffAccessToken);
        staffRole = payload?.role?.name;
    }

    // Protected admin routes (reports)
    const adminRoutes = ['/dashboard/reports'];
    if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
    }

    // Protected staff routes (beneficiary management, household details)
    const staffRoutes = ['/dashboard/gnd-user', '/dashboard/household-details'];
    if (staffRoutes.some(route => pathname.startsWith(route))) {
        if (!staffRole || staffRole !== 'GND User') {
            return NextResponse.redirect(new URL('/dashboard/api-status', request.url));
        }
    }

    // If user is admin trying to access staff routes, redirect to admin dashboard
    if (isAdmin && staffRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};