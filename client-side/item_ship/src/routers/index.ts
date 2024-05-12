import {
	createRouter,
	createWebHashHistory,
	RouteLocationNormalized,
} from "vue-router";
import {Cookie, Session} from "@/utils/storage.ts";
import {userInfo} from "@/stores/userInfo.ts";
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
		const token = Session.get("token");
		alert(token + '<---------------------token')
		if (token) {
			next();
		} else {
			await stores.login({});
			// 移除 token 参数
			//
			// // 重新设置 URL 的查询参数
			// url.search = params.toString();
			// // 使用 history.replaceState 方法更新 URL，不会在浏览器历史中留下记录
			// window.history.replaceState({}, '', url.toString());
			// window.history.replaceState(null, "", window.location.pathname);
		}
	}
);

export default router;
