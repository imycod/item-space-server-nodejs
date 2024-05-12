import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios"
import {parseUrl} from "./index.ts";

const ins = axios.create({
    baseURL: '/',
    timeout: 10000
})


function requestSuccessCallback(config: AxiosRequestConfig<any>) {
    const paramsObj = parseUrl(location.href)
    //@ts-ignore
    const {client_id,redirect_uri,response_type}=paramsObj.params
    config.headers['client_id'] = client_id;
    config.headers['redirect_uri'] = redirect_uri;
    config.headers['response_type'] = response_type;

    return config
}

function requestErrorCallback(error) {
    return Promise.reject(error)
}

ins.interceptors.request.use(requestSuccessCallback, requestErrorCallback)
ins.interceptors.response.use(responseSuccessCallback, responseErrorCallback)

function responseSuccessCallback(response: AxiosResponse<any>) {
    if (response.status === 206) {
        window.location.href = response.headers.location;
        throw response.data;
    }
    return response.data;
}

function responseErrorCallback(error) {
    return Promise.reject(error)
}

export default ins