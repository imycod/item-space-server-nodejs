import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
} from 'vue-router';

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
        },
    ],
});

eventEmitter.on('API:UN_LOGIN', (response) => {
    window.location.href = response.headers.location
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    const stores = userInfo()
    const loggedIn = await stores.checkStatus()
    if (loggedIn) {
        next()
    }
})

export default router