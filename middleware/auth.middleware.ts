import { NextRequest, NextResponse } from 'next/server'
import { getCookie } from 'cookies-next'
import {validateToken} from "../lib/auth.lib";

export async function authMiddleware(request: NextRequest) {
    // Define protected routes
    const protectedRoutes = ['/profile', '/home']

    // Skip middleware for public routes
    if (!protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    // Get token from cookie
    const token = getCookie('jwt')

    // Optimistic check: verify token presence and basic structure
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Secure check: validate token with backend
    const isValid = await validateToken(token)

    if (!isValid) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Configure middleware to run on protected routes
export const config = {
    matcher: ['/profile/:path*', '/home/:path*']
}