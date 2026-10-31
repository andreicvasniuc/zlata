# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Zlata Wedding Fashion website: a Rails 8.1 JSON API (Ruby 4.0, Mongoid 9 / MongoDB 8) plus a Vue 3 + TypeScript frontend in `client/` (public site and admin). README.md is the main reference. DEPLOYMENT_RUNBOOK.md, UPGRADE_PLAN.md and FRONTEND_UPGRADE_PLAN.md cover deployment and the upgrade history.

## Commands

The backend runs only in Docker; Ruby and Mongo aren't installed on the host. The shell is PowerShell on Windows.

```powershell
docker compose up -d                                              # mongo, mongoku (:3100), web (:3000)
docker compose run --rm -e RAILS_ENV=test web bundle exec rspec   # all request specs (db ishop_test, purged each run)
docker compose run --rm -e RAILS_ENV=test web bundle exec rspec spec/requests/public/catalog_spec.rb:42
docker compose run --rm web bin/rubocop                           # rubocop-rails-omakase
docker compose run --rm web bin/ci                                # rubocop, bundler-audit, brakeman (config/ci.rb)
```

Frontend (`client/`, Node 24, pnpm via corepack):

```powershell
pnpm dev                     # :5173, proxies the API to Rails on :3000 (VITE_PROXY_TARGET)
pnpm check                   # vue-tsc + eslint + vitest
pnpm test -- src/app/components/ContactForm.spec.ts   # single Vitest file
pnpm test:e2e                # Playwright; needs Rails + local data + $env:E2E_ADMIN_TOKEN
pnpm exec playwright test e2e/admin/products.spec.ts
pnpm build                   # vue-tsc, then writes ../public/build
```

## Frontend build output is committed

Heroku uses only the classic Ruby buildpack and never builds the frontend. Any change under `client/src` needs `pnpm build` and the regenerated `public/build/` in the **same commit**, or production keeps serving the old version. Never hand-edit `public/build/`. `HomeController` renders the HTML shells (`app/views/home/*.html.erb`), and `ViteHelper#vite_tags` reads `public/build/.vite/manifest.json`. If the manifest names a missing file, `ViteHelper::MissingEntry` makes pages return 500. `spec/helpers/vite_helper_spec.rb` and the shell specs catch this.

## Architecture

- **Two model hierarchies on the same Mongo collections.** Each entity has a public model (`app/models/product.rb`) and an admin model (`app/models/admin/product.rb`). Both include a shared concern (`app/models/concerns/*_concern.rb`) that declares the fields, `store_in`, the slug and `as_json`. The public models add published-only scopes. The admin models add search, image handling and `after_create :create_for_all_locales`, which uses `LocaleLooper` to copy the new values into every locale. New fields go in the concern, and in the admin controller's strong params.
- **Embedded documents.** Products are embedded in collections, images in products, slides in sliders and contacts in contact groups. Routes and the admin controllers follow this nesting (e.g. `/admin/collections/:collection_id/products/:id`), so there is no top-level product lookup.
- **Localization.** Text fields use `localize: true` with locales `en|ua|ru|ro`. The locale comes from the optional `/(:locale)` URL prefix, which `ApplicationController#set_locale` reads. Public API: `/(:locale)/api/...`. Admin API: `/:locale/admin/...`. SEO strings live in `config/locales/seo.*.yml`.
- **Auth.** `POST /user_token` returns a JWT (`app/services/auth_token.rb`, signed with `SECRET_KEY_BASE`). Admin controllers inherit `SecuredController` (Bearer token through `Authenticable`).
- **ID JSON format.** `config/initializers/bson_object_id_json.rb` keeps ObjectIds as `{"$oid": "..."}`, matching the old API (`lib/data_processor.rb` and the API snapshots depend on it). In the frontend, `client/src/shared/api/normalize.ts` is the only place that maps `_id`/`$oid` to a string `id`.
- **SEO shell.** `PageMeta` (`app/services/page_meta.rb`) computes the title, meta and OG tags, canonical URL and hreflang for each public URL, and returns 404 for unknown or unpublished collections and products. `/sitemap.xml` comes from `SitemapsController`.
- **Frontend.** One Vite project with two entries: `src/app` (public site, Tailwind) and `src/admin` (PrimeVue). They share `src/shared` (typed API client in `api/resources`, session/token, i18n and locale files). Aliases: `@app`, `@admin`, `@shared`. In dev, a Vite plugin serves the SPA fallback; in production, Rails serves it.
- **Admin data export/import.** `Admin::DataController` → `lib/data_processor.rb`; import files are in `public/data/*.json`.

## Notes

- The API must stay compatible with the old app's responses. `script/api_snapshot.rb` records and compares responses (see README, "Checking the API against the old version").
- Playwright e2e specs create and delete `e2e-`-prefixed records in the local dev database.
- Deploy: `.\deploy.ps1` pushes the committed state of `develop` to Heroku app `zlata-weddingfashion`. Deploying to production is outward-facing, so confirm with the user first.
