import { defineConfig, devices } from '@playwright/test'

// Specs run against a Rails app on the local data copy: the new apps are served by the Vite dev server (proxying
// the API to Rails). Start both with `docker compose --profile frontend up`.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  // the specs share one local database (and clean up each other's `e2e-` data)
  workers: 1,
  reporter: [['list']],
  use: { baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
