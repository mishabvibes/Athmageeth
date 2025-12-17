import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /admin routes (except /admin/login)
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        const session = request.cookies.get('session')?.value;

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
        }

        try {
            await decrypt(session);
            return NextResponse.next();
        } catch (err) {
            // Invalid token
            return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
