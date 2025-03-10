import { getCookie } from 'cookies-next'

export async function validateToken(token: any) {
    try {
        const URL = process.env.BE_URL
        JSON.stringify(token)
        const tokenData = {"token": token}
        const response = await fetch(`${URL}/auth/validate`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(tokenData),
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
    const token = getCookie('token')
    return token ? token : null
}