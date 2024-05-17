/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 20:51:33
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-17 07:01:14
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\client-side\item_di\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios"
import eventEmitter from "@/utils/eventEmitter.ts";
import {Local, Session} from "@/utils/storage.ts"

const ins = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
})

function requestSuccessCallback(config: AxiosRequestConfig<any>) {
    // 统一增加Authorization请求头, skipToken 跳过增加token
    const token = Session.get('token');
    if (token && !config.headers?.skipToken) {
        config.headers['authorization'] = `Bearer ${token}`;
    }
    config.headers['client_id'] = import.meta.env.VITE_CLIENT_ID;

    return config
}

function requestErrorCallback(error) {
    // 对请求错误进行处理
    if (error.response.status === 401) {
        eventEmitter.emit('API:UN_AUTHORIZED')
    } else if (error.response.status === 400) {
        eventEmitter.emit('API:VALIDATION_ERROR', error.response.data)
    }
    return Promise.reject(error)
}

ins.interceptors.request.use(requestSuccessCallback, requestErrorCallback)
ins.interceptors.response.use(responseSuccessCallback, responseErrorCallback)

function responseSuccessCallback(response: AxiosResponse<any>) {
    if (response.status === 206) {
        eventEmitter.emit('API:UN_LOGIN', response)
        Session.clear();
        throw response.data;
    }
    return response.data;
}

function responseErrorCallback(error) {
    console.log('error.response---',error.response);
    
    const status = Number(error.response?.status)
    if (status === 401) {
        const queryString = new URLSearchParams(error.response.data.query).toString();
        console.log('queryString---',queryString);
        
        eventEmitter.emit('API:UN_LOGIN',error.response)
        Session.clear();
    }
    if (status === 424) {
        Session.clear(); // 清除浏览器全部临时缓存
        return;
    }
    if (status === 404) {
        eventEmitter.emit('API:NOT_FOUND')
    }
    if (status === 500){
        eventEmitter.emit('API:NOT_SERVICE_ERROR')
    }
    return Promise.reject(error)
}

export default ins