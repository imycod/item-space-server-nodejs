import {
    createRouter,
    createWebHistory,
} from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            component: () => import("@/views/Login.vue"),
        },
        {
            path: "/decision",
            component: () => import("@/views/Decision.vue"),
        },
    ],
});

export default router;
