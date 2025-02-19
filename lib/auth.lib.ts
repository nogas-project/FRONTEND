import { getCookie } from 'cookies-next'

export async function validateToken(token: any) {
    try {
        const port = process.env.BE_PORT || 3001
        const response = await fetch(`http://localhost:${port}/auth/validate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        return data
    } catch {
        return false
    }
}

export function getTokenFromCookie() {
    const token = getCookie('jwt')
    return token ? token : null
}