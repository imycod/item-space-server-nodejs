import request from "@/utils/request.ts"
import qs from 'qs';

export function checkUserStatus() {
    return request('/v1/user/status')
}