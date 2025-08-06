export function middleware() {
    // const { pathname } = request.nextUrl;
    // const staffAccessToken = request.cookies.get('staffAccessToken')?.value;

    // // Function to decode JWT
    // const decodeJWT = (token: string) => {
    //     try {
    //         const payload = Buffer.from(token.split('.')[1], 'base64').toString();
    //         return JSON.parse(payload);
    //     } catch {
    //         return null;
    //     }
    // };

    // // Check if user is staff
    // let staffRole = null;
    // if (staffAccessToken) {
    //     const payload = decodeJWT(staffAccessToken);
    //     staffRole = payload?.roleName;
    // }

    // // Protected staff routes (beneficiary management, household details)
    // // const staffRoutes = ['/dashboard/gnd-user', '/dashboard/household-details'];
    // // if (staffRoutes.some(route => pathname.startsWith(route))) {
    // //     if (!staffRole || staffRole !== 'GND User') {
    // //         return NextResponse.redirect(new URL('/dashboard/api-status', request.url));
    // //     }
    // // }

    // return NextResponse.next();
}

export const config = {
    // matcher: [
    //     '/dashboard/:path*',
    // ],
};