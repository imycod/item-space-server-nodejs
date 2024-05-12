import {defineStore} from 'pinia'
import {login as LoginApi, toAuthorize} from "@/api/login/index"
import {checkUserStatus} from "@/api/user";

export const userInfo = defineStore('userInfo', {
    state: () => ({
        uername: '',
        loginStatus:false,
    }),
    actions: {
        async authorize(){
            toAuthorize()
        },
        async login(data) {
            await LoginApi(data)
        },
        async checkStatus() {
            const result = await checkUserStatus()
            this.loginStatus = result.loggedIn!
            return result.loggedIn
        },
        refreshToken() {
            console.log('refreshToken')
        }
    }
})