import request from "@/utils/request.ts"
import qs from 'qs';

export function checkUserStatus() {
    return request('/api/user/status')
}