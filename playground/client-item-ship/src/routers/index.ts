import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
} from "vue-router";
import { Cookie, Session } from "@/utils/storage.ts";
import { userInfo } from "@/stores/userInfo.ts";
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
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
    },
  ],
});

eventEmitter.on("API:UN_LOGIN", (response) => {
  alert(response.headers.location);
  window.location.href = response.headers.location;
});

function parseUrl(url) {
  const parsedUrl = new URL(url);
  const params = {};

  // 获取查询参数
  parsedUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return {
    protocol: parsedUrl.protocol,
    host: parsedUrl.host,
    pathname: parsedUrl.pathname,
    params: params
  };
}
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: any
  ) => {
    const stores = userInfo()
    // const token = Session.get("token");
    // alert(token)
    const {params}= parseUrl(window.location.href)
    if (params.token) {
      next();
    }else{
      await stores.login({});
    }
  }
);

export default router;
