import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token-emp")?.value;

    const isPublicRoute = request.nextUrl.pathname === "/login";

    if (!token && !isPublicRoute)
        return NextResponse.redirect(new URL("/login", request.url));

    if (token && isPublicRoute)
        return NextResponse.redirect(new URL("/", request.url));

    return NextResponse.next();

}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (sua pasta de imagens publicas, se tiver)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}