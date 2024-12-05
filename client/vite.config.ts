import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import env from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),
        env({
            include: [
                'VITE_APP_API_URL',
            ],
        }),
    ],
    server: {
        port: 5173
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    }
})