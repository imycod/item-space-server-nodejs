/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 20:51:33
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-16 23:49:06
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\client-side\item_di\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"

// https://vitejs.dev/config/
export default defineConfig((mode) => {
    return {
        base: "./",
        plugins: [vue()],
        // build: {
        //     outDir: path.resolve(__dirname, '../server/src/views/di'),
        // },
        server: {
            port: 5133,
            proxy: {
                "/api": {
                    target: "http://127.0.0.1:3001",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
                "/auth": {
                    target: "http://127.0.0.1:3000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/auth/, ""),
                },
            },
        },
        resolve: {
            alias: {
                "@": "/src",
            },
        },
        define: {
            __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
        },
    }
});
