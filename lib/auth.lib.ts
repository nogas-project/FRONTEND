import { getCookie } from 'cookies-next'

export async function validateToken(token: any) {
    const URL = process.env.BE_URL;
    try {
        const port = process.env.BE_PORT || 3001
        JSON.stringify(token)
        const tokenData = {"token": token}
        console.log(tokenData)
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
        console.log(data)
        return data
    } catch {
        return false
    }
}

export function getTokenFromCookie() {
    const token = getCookie('token')
    return token ? token : null
}