import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Connect, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'

const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:3000'

// Requests that belong to the Rails API: `/(:locale)/api/...`, `/:locale/admin/...` and `/user_token`.
// SPA routes never carry a locale in front of `admin`, so they are not matched.
const apiPattern = /^\/((en|ua|ru|ro)\/)?api(\/|$)|^\/(en|ua|ru|ro)\/admin(\/|$)|^\/user_token$/
const adminPattern = /^\/admin(\/|$)/

// Dev-only history-API fallback for the two HTML entries (Rails serves the shell in production).
const spaFallback = (): Plugin => ({
  name: 'zlata:spa-fallback',
  configureServer(server) {
    const handler: Connect.NextHandleFunction = (req, _res, next) => {
      const pathname = (req.url ?? '/').split('?')[0] ?? '/'
      const isPage =
        req.method === 'GET' && !pathname.includes('.') && !pathname.startsWith('/@') && !apiPattern.test(pathname)
      if (isPage) req.url = adminPattern.test(pathname) ? '/admin.html' : '/app.html'
      next()
    }
    server.middlewares.use(handler)
  },
})

export default defineConfig(({ command }) => ({
  // Build output is served by Rails from public/build (see `vite_tags`); the dev server serves from `/`.
  base: command === 'build' ? '/build/' : '/',
  plugins: [vue(), tailwindcss(), Icons({ compiler: 'vue3' }), spaFallback()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@admin': fileURLToPath(new URL('./src/admin', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: process.env.VITE_USE_POLLING ? { usePolling: true } : undefined,
    proxy: {
      '^/((en|ua|ru|ro)/)?api(/|$)': proxyTarget,
      '^/(en|ua|ru|ro)/admin(/|$)': proxyTarget,
      '^/user_token$': proxyTarget,
    },
  },
  build: {
    outDir: '../public/build',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./src/app/main.ts', import.meta.url)),
        admin: fileURLToPath(new URL('./src/admin/main.ts', import.meta.url)),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    globals: false,
  },
}))
