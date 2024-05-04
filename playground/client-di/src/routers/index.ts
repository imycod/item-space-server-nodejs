import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
} from 'vue-router';

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


router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    next()
})

export default router