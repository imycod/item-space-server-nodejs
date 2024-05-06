import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios"
import eventEmitter from "@/utils/eventEmitter.ts";
import {Local, Session} from "@/utils/storage.ts"
import {refreshToken} from "@/api/token/index.ts"

const ins = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
})

function requestSuccessCallback(config) {
    // 统一增加Authorization请求头, skipToken 跳过增加token
    // const token = Session.get('token');
    if (config.skipToken && config.isRefreshToken) {
        const refresh_token = localStorage.getItem('refresh_token');
        config.headers['authorization'] = `Bearer ${refresh_token}`;
    }

    const token = localStorage.getItem('token');
    if (token && !config.skipToken) {
        config.headers['authorization'] = `Bearer ${token}`;
    }
    config.headers['client_id'] = import.meta.env.VITE_CLIENT_ID;

    return config
}

function requestErrorCallback(error) {
    // 对请求错误进行处理
    console.log('error----', error)
    if (error.response.status === 401) {
        eventEmitter.emit('API:UN_AUTHORIZED')
    } else if (error.response.status === 400) {
        eventEmitter.emit('API:VALIDATION_ERROR', error.response.data)
    }
    return Promise.reject(error)
}

ins.interceptors.request.use(requestSuccessCallback, requestErrorCallback)
ins.interceptors.response.use(responseSuccessCallback, responseErrorCallback)


// 是否正在刷新，正在刷新不要触发重试
let isRefreshing = false
// 重试队列，每一项将是一个待执行的Promise函数
let retryRequests = []

function responseSuccessCallback(response: AxiosResponse<any>) {
    console.log('response----responseSuccessCallback', response.data)
    console.log('response.config----', response.config);
    if (response.status === 206) {
        eventEmitter.emit('API:UN_LOGIN', response)
        Session.clear();
        throw response.data;
    }
    if (response.data.code === 0) {
        const token = response.headers['authorization'].replace('Bearer ', '');
        const refresh_token = response.headers['x-refresh-token']
        localStorage.setItem('token', token)
        refresh_token && localStorage.setItem('refresh_token', refresh_token)
        return response.data
    }
    if (response.data.code === 401) {
        const {config} = response
        if (!isRefreshing) {
            isRefreshing = true
            return refreshToken().then(res => {
                console.log('refreshToken----------> res------',res)
                isRefreshing = false
                retryRequests.forEach(cb => cb(res))
                retryRequests = []
                return ins.request(config)
            }).catch(err => {
                isRefreshing = false
                // 刷新token也过期了
                retryRequests = []
                return Promise.reject(err)
            })
        } else {
            return new Promise((resolve) => {
                retryRequests.push((res) => {
                    console.log('res----',res)
                    resolve(ins.request())
                })
            })
        }
    }
}

function responseErrorCallback(error) {
    const status = Number(error.response.status)
    if (status === 424) {
        Session.clear(); // 清除浏览器全部临时缓存
        return;
    }
    if (status === 404) {
        eventEmitter.emit('API:NOT_FOUND')
    }
    if (status === 500) {
        eventEmitter.emit('API:NOT_SERVICE_ERROR')
    }
    return Promise.reject(error)
}

export default ins