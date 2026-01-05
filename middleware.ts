import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/bookings', '/profile', '/vendor/dashboard'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // Static files
    ) {
        return NextResponse.next();
    }

    // Check if Supabase env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If no Supabase config, just pass through
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next();
    }

    // Create response to modify cookies
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Create Supabase client for server-side
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Get current session (this also validates the JWT)
    const { data: { session } } = await supabase.auth.getSession();

    const isAuthenticated = !!session;
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const redirectUrl = new URL('/signin', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Optional: Redirect authenticated users away from signin/signup
    if ((pathname === '/signin' || pathname === '/signup') && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
