import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
    const env = loadEnv(mode.mode, process.cwd());

    return {
        plugins: [vue()],
        server: {
            port: 5134,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                },
                '/v1': {
                    target: 'http://localhost:3001',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/v1/, '')
                },
                '/oauth': {
                    target: 'http://localhost:3001',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/oauth/, '')
                },
                '/ollama': {
                    target: 'http://localhost:11434/api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/ollama/, '')
                },
            }
        },
        resolve: {
            alias: {
                '@': '/src'
            }
        },
        define: {
            __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
        },
    }
})
