import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
} from 'vue-router';
import {Cookie, Session} from "@/utils/storage.ts";
import {userInfo} from "@/stores/userInfo.ts";
import eventEmitter from "@/utils/eventEmitter.ts";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Home.vue'),
        },
        {
            path: '/about',
            component: () => import('@/views/About.vue'),
        }, {
            path: '/login',
            component: () => import('@/views/Login.vue'),
        },
    ],
});

eventEmitter.on('API:UN_LOGIN', (response) => {
    alert(response.headers.location)
    window.location.href = response.headers.location
})

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    const stores = userInfo()
    const loggedIn = await stores.checkStatus()
    // if (loggedIn) {
    //     next()
    // }
    next()
})

export default router