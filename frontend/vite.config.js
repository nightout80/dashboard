import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/dashboard': 'http://localhost:8000',
            '/design-tokens': 'http://localhost:8000',
            '/boxplot': 'http://localhost:8000',
        }
    }
})

