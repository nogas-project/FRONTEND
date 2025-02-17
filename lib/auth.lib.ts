import { getCookie } from 'cookies-next'

export async function validateToken(token: any) {
    try {
        // Make request to your backend validation endpoint
        const port = process.env.BE_PORT || 3001
        const response = await fetch(`http://localhost:${port}/auth/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) return false

        const data = await response.json()
        return data.isValid
    } catch {
        return false
    }
}

export function getTokenFromCookie() {
    const token = getCookie('jwt')
    return token ? token : null
}