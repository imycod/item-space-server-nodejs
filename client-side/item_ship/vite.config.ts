import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    // https://blog.csdn.net/qq_43548590/article/details/124554468
    base: "./", // 默认是 /assets 但是看你需要部署到哪里,如果你部署的和服务器放到一起的话就是 / 如果是放到服务器的某个目录下就是 /xxx
    plugins: [vue()],
    // build: {
    //   outDir: path.resolve(__dirname, '../server/src/views/ship'),
    // },
    server: {
      port: 5134,
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
  };
});
