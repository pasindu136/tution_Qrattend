
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect Dashboard Routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check Profile Approval
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_approved, role')
            .eq('id', user.id)
            .single()

        if (profile && !profile.is_approved) {
            return NextResponse.redirect(new URL('/pending', request.url))
        }
    }

    // Protect Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin-otp-verify')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Check Admin Role
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // If error or not admin, redirect to dashboard
        if (error || !profile || profile.role !== 'admin') {
            console.log("Access denied to admin panel for user:", user.email)
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Check if admin OTP is verified
        const isOtpVerified = request.cookies.get('admin_otp_verified')?.value === 'true'
        if (!isOtpVerified) {
            return NextResponse.redirect(new URL('/admin-otp-verify', request.url))
        }
    }

    // Redirect logged-in users away from Login
    if (request.nextUrl.pathname === '/login' && user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'admin') {
            const isOtpVerified = request.cookies.get('admin_otp_verified')?.value === 'true'
            if (!isOtpVerified) {
                return NextResponse.redirect(new URL('/admin-otp-verify', request.url))
            }
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}
