import { NextResponse } from 'next/server';
import { userAgent } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl;
    const { pathname } = url;

    // Skip public files, API routes, and the public scanning route
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/scan') // Allow public access to QR scan routes
    ) {
        return NextResponse.next();
    }

    // Mobile/Desktop Detection for Login
    if (pathname === '/login') {
        const { device } = userAgent(request);
        const isMobile = device.type === 'mobile';
        const response = NextResponse.next();
        response.headers.set('x-device-type', isMobile ? 'mobile' : 'desktop');
        return response;
    }

    // Strict Protection for dynamic cafe routes: /:cafe_slug/...
    // Regex to match /:cafe_slug and capture it
    const match = pathname.match(/^\/([a-zA-Z0-9-]+)(\/|$)/);

    if (match) {
        const routeSlug = match[1];

        // Ignore public routes like /login, /demo (if any)
        if (['login', 'demo', 'favicon.ico'].includes(routeSlug)) {
            return NextResponse.next();
        }

        // Check for auth token
        const token = request.cookies.get('token');

        if (!token) {
            // Redirect to login if no token
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Decode Token to check slug (Simple Base64 decode of payload)
        try {
            const payloadBase64 = token.value.split('.')[1];
            if (payloadBase64) {
                const payloadJson = atob(payloadBase64);
                const payload = JSON.parse(payloadJson);

                // Check if token cafe.slug matches the route
                if (payload.cafe && payload.cafe.slug !== routeSlug) {
                    // Trying to access another cafe's dashboard
                    // Redirect to THEIR dashboard or login?
                    // Requirement: "redirects me back to /login"
                    return NextResponse.redirect(new URL('/login', request.url));
                }
            }
        } catch (e) {
            // Invalid token
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
