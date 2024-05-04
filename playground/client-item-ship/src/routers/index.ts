import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
} from 'vue-router';
import {Session} from "@/utils/storage.ts";
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
    alert(response.headers.location)
    window.location.href = response.headers.location
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    const token = Session.get('token')
    if (!token) {
        userInfo().login({})
    }else{
        next()
    }
})

export default router