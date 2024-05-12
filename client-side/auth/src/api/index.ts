import request from "@/utils/request.ts";

interface AuthorizeType {
    email: string;
    password: string;
}

export function login(data: AuthorizeType) {
    return request('/api/auth/login', {
        method: 'POST',
        data
    })
}

interface DecisionType {
    transaction_id: string;
    decision: string;
}

export function decision(data: DecisionType) {
    return request('/api/auth/decision', {
        method: 'POST',
        data
    })
}