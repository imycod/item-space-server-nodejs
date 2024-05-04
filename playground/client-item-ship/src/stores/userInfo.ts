import {defineStore} from 'pinia'
import {login as LoginApi} from "@/api/login/index"

export const userInfo = defineStore('userInfo', {
    state: () => ({
        uername: '',
    }),
    actions: {
        async login() {
            console.log('login')
            await LoginApi({})
        },

        refreshToken() {
            console.log('refreshToken')
        }
    }
})