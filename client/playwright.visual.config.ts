import { defineConfig, devices } from '@playwright/test'

// Captures screenshots of the NEW public site for the visual diff against the baseline (FRONTEND_UPGRADE_PLAN.md,
// Phase 3):
//
//   docker compose up -d mongo web
//   VITE_PROXY_TARGET=http://localhost:3000 pnpm exec vite --port 5175
//   pnpm exec playwright test -c playwright.visual.config.ts
//   node e2e/visual/compare.ts                 # writes e2e/visual-screenshots/diff/*.png and prints a summary
export default defineConfig({
  testDir: './e2e/visual',
  testMatch: '*.capture.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 10 * 60 * 1000,
  reporter: [['list']],
  use: {
    baseURL: process.env.VISUAL_URL ?? 'http://localhost:5175',
    ...devices['Desktop Chrome'],
  },
})
