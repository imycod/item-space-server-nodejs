import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"

// https://vitejs.dev/config/
export default defineConfig((mode) => {
    console.log('__dirname----', __dirname)
    console.log(path.resolve(__dirname, '../server/src/views/di'))
    return {
        base: "./",
        plugins: [vue()],
        build: {
            outDir: path.resolve(__dirname, '../server/src/views/di'),
        },
        server: {
            port: 5133,
            proxy: {
                "/api": {
                    target: "http://127.0.0.1:3000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
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