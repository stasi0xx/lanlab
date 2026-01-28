// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
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
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // OCHRONA TRAS ADMINA
    // Jeśli użytkownik nie jest zalogowany i próbuje wejść na /admin...
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        // ...przekieruj go na /login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Jeśli użytkownik JEST zalogowany i próbuje wejść na /login...
    if (request.nextUrl.pathname === '/login' && user) {
        // ...przekieruj go od razu do /admin
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
}