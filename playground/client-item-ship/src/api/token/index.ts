import request from "@/utils/request.ts"

export function refreshToken() {
    return request.get('/v1/token/refresh',{
        skipToken: true,
        isRefreshToken: true
    })
}

export function getProtection() {
    return request.get('/v1/token/protection')
}

export function getToken() {
    return request.post('/v1/token/login', {
        username: 'wuxingshi'
    })
}