/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 20:51:33
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-17 05:54:28
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\client-side\item_di\src\routers\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
} from "vue-router";

import { userInfo } from "@/stores/userInfo.ts";
import {Local, Session} from "@/utils/storage.ts"
import eventEmitter from "@/utils/eventEmitter.ts";
import {toAuthorize} from "@/api/login";

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
  window.location.href = response.data.redirectUrl;
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: any
  ) => {
    const stores = userInfo();
    const token = Session.get("token");
    if (token) {
      next();
    } else {
      await stores.login({});
    }
  }
);

export default router;
