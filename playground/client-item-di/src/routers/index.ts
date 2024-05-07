import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
} from "vue-router";

import { userInfo } from "@/stores/userInfo.ts";
import {Local, Session} from "@/utils/storage.ts"
import eventEmitter from "@/utils/eventEmitter.ts";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/about",
      component: () => import("@/views/About.vue"),
    },
  ],
});

eventEmitter.on("API:UN_LOGIN", (response) => {
  alert(response.headers.location);
  window.location.href = response.headers.location;
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: any
  ) => {
    const stores = userInfo();
    const token = Session.get("token");
    alert(token + "<---------------------token");
    if (token) {
      next();
    } else {
      await stores.login({});
    }
  }
);

export default router;
