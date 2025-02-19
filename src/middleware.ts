import { NextRequest, NextResponse } from 'next/server'
import { getCookie } from 'cookies-next'
import {validateToken} from "../lib/auth.lib";

export async function middleware(request: NextRequest) {
    // Define protected routes
    const protectedRoutes = ['/profile', '/home']

    // Skip middleware for public routes
    if (!protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    // Get token from cookie
    const token = request.cookies.get("token")

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const tokenValue = token.value
    // Secure check: validate token with backend
    //@ts-ignore
    const isValid = await validateToken(tokenValue)

    if (!isValid) {
        return NextResponse.redirect(new URL('/register', request.url))
    }

    return NextResponse.next()
}

// Configure middleware to run on protected routes
export const config = {
    matcher: ['/profile', '/home']
}