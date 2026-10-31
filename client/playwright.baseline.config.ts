import { defineConfig, devices } from '@playwright/test'

// Captures screenshots of the OLD (AngularJS) apps for the visual baseline (FRONTEND_UPGRADE_PLAN.md, Phase 1).
//
//   docker compose up -d mongo web && docker compose --profile baseline up -d baseline
//   E2E_ADMIN_TOKEN=$(docker compose exec -T web bin/rails runner 'puts AuthToken.issue(User.first)') \
//     pnpm exec playwright test -c playwright.baseline.config.ts
//
// The baseline app runs in production mode and redirects to https, hence the forwarded-proto header.
export default defineConfig({
  testDir: './e2e/baseline',
  testMatch: '*.capture.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 10 * 60 * 1000,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASELINE_URL ?? 'http://localhost:3001',
    extraHTTPHeaders: { 'X-Forwarded-Proto': 'https' },
    ...devices['Desktop Chrome'],
  },
})
