import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the request is for the root path
    if (request.nextUrl.pathname === '/') {
        // Redirect to /signin
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/'
}