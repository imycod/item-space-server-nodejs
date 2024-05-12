import request from "@/utils/request.ts"

export function checkUserStatus() {
    return request('/api/user/status')
}