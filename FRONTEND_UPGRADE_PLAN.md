# Frontend Upgrade Plan — Zlata (zlata-weddingfashion.com)

_Last updated: 2026-10-31. Based on a review of `client/` and the decisions below. Starts only after the backend upgrade in [UPGRADE_PLAN.md](UPGRADE_PLAN.md) is live in production._

## 0. Decisions

| Topic | Decision |
|---|---|
| Framework | **Vue 3 + Vite**, single-page apps (SPAs) for both the public site and the admin |
| Language | **TypeScript, strict** from the start; API types shared by both apps |
| Project layout | **One Vite project** in `client/`, two entries (`app`, `admin`), shared code in `src/shared` |
| Styles | **Tailwind CSS 4**, recreating the current look with design tokens |
| Admin UI kit | **PrimeVue** (DataTable, Dialog, Tabs, Toast, etc.) |
| Design | **Keep the current look**; small UX fixes allowed; checked against Playwright screenshots of the old site |
| Order | **Admin first**, then the public site |
| Build and deploy | Build locally or in Docker, **commit the build output** to `public/build/`; a Rails helper reads Vite's `manifest.json`. Heroku stays on the Ruby buildpack only |
| SEO | SPA stays; **Rails renders per-page meta tags** (title, description, Open Graph, canonical, hreflang) into the HTML shell |
| API contract | **Unchanged**; the client maps `_id.$oid` → `id` in one place |
| Tooling | **pnpm + Node 24 LTS** |
| Timing | Starts **after** the backend upgrade is in production |

## 1. Current state

- Two AngularJS 1.8 SPAs: public site (`src/app`, 6 routes) and admin (`src/admin`, 13 routes). ~6.7k lines of `.jsx`, 93 HTML templates, 28 Stylus files, ~6k lines of vendored CSS.
- Build: webpack 4, webpack-cli 3, Babel 6 and 7 both installed, about 15 loaders and plugins. Output is committed to `public/assets/{app,admin}`; hashed file names are hand-edited in `app/views/home/*.html.erb`.
- Libraries: angular-route/resource/cookies/jwt/translate, ui-bootstrap, ui-grid (57 usages), toastr, ng-flow (commented out), angular-lightgallery, Bootstrap 3.4, jQuery plus 6 jQuery plugins, lodash.
- i18n: `public/i18n/{app,admin}/{en,ua,ru,ro}.json`, loaded at runtime.
- Auth: JWT kept in `sessionStorage`. **The login also stores the admin's email and plain-text password in cookies** (`admin/controllers/login/index.jsx`).
- SEO: there are no per-page meta tags, unknown paths return 200, and `sitemap.xml` returns 406.
- No tests, no linting, no type checking.

## 2. Target stack (majors as of 2026-10-31; pin exact versions at the start of Phase 1)

| Concern | Target | Replaces |
|---|---|---|
| Runtime / package manager | Node 24 LTS, pnpm (via `packageManager` field) | Node 16, npm |
| Build | Vite 8 (Rolldown), `@vitejs/plugin-vue`, multi-page build | webpack 4 and all loaders/plugins |
| Framework | Vue 3.5 (no Vapor mode while it's a release candidate) | AngularJS 1.8 |
| Routing / state | Vue Router, Pinia | angular-route, `$rootScope` |
| HTTP | Typed `fetch` wrapper (`ofetch`) in `src/shared/api` | angular-resource, angular-jwt |
| i18n | vue-i18n, locale files moved to `src/shared/locales`, lazy-loaded per locale | angular-translate (+ loaders, cookie storage) |
| Admin UI | PrimeVue 4 (unstyled/Tailwind mode) | ui-grid, ui-bootstrap, toastr |
| Carousel | Embla Carousel (`embla-carousel-vue` + autoplay) | owl.carousel |
| Gallery / lightbox | PhotoSwipe 5 (MIT) | angular-lightgallery, lg-fullscreen, magnific-popup |
| Styles | Tailwind CSS 4 (`@tailwindcss/vite`), Vue scoped styles where needed | Bootstrap 3, Stylus, SB Admin CSS |
| Icons | Lucide / Iconify via `unplugin-icons` (closest equivalents) | Themify, Font Awesome 4 |
| Fonts | Fontsource (self-hosted Lato, Crimson Text) | Google Fonts `<link>` |
| Removed, no replacement | jQuery, lodash, FastClick, superfish, hoverintent, jquery.easing, easy-responsive-tabs | — |
| Lint / format | ESLint 9 flat config + typescript-eslint + eslint-plugin-vue, Prettier | none |
| Type check | `vue-tsc` | none |
| Tests | Vitest + Vue Test Utils (unit/component), Playwright (end-to-end + visual) | none |

## 3. Design and compatibility work

### 3.1 API client and contract
- One typed client in `src/shared/api`, used by both apps. Request paths stay `/(:locale)/api/...` and `/(:locale)/admin/...`.
- One normalizer maps `_id: {$oid}` → `id: string` on responses and maps it back when building URLs. No `$oid` anywhere else in the code.
- Admin auth: `POST /user_token` → 201 `{jwt}`; **404 = invalid credentials**; the token goes in `sessionStorage` and is sent as `Authorization: Bearer`; any 401 → clear the token and redirect to login.
- Dev server: Vite proxies `/api`, `/admin/*` API calls, `/user_token` to the Rails app (no CORS needed locally).

### 3.2 Security fix (admin)
- Remove the email/password cookies. On load, the new login page deletes any existing `email` and `password` cookies.
- After the admin cutover: **change the admin password**.

### 3.3 Build output and Rails integration
- Vite `outDir: ../public/build`, `base: /build/`, `manifest: true`. It's a separate folder so the old `public/assets` keeps working during the side-by-side period.
- Rails helper `vite_tags(entry)` reads `public/build/.vite/manifest.json` and emits the `<script type="module">`, CSS `<link>` and `modulepreload` tags. No hand-edited hashes.
- Remove the `no-cache` `<meta http-equiv>` tags. Hashed assets get long cache headers; the HTML shell isn't cached.
- Build command: `pnpm build` (inside the Docker `frontend` profile). The output and manifest are committed in the same commit as the source change.

### 3.4 SEO: meta tags from Rails
- `HomeController#index` resolves the URL (`/:locale?`, `/collections`, `/accessories`, `/contacts`, `/:collection`, `/:collection/:product`) and sets `<html lang>`, `<title>`, meta description, `og:title/description/image/url`, canonical, and `hreflang` alternates for en/ua/ru/ro.
- An unknown collection or product returns the SPA shell with **HTTP 404**.
- Optional: `sitemap.xml` generated by Rails from collections and products.
- The client still updates `document.title` on navigation.

### 3.5 URL and behaviour compatibility
- Public and admin route paths stay identical, so shared links and indexed URLs keep working.
- Language choice: the URL locale wins, then the saved preference, then `ua` (the current default); fallback is `en`.
- Translation strings: angular-translate `{{ var }}` interpolation is converted to vue-i18n `{var}`; check every key that uses parameters.

### 3.6 Side-by-side rollout
- During Phase 2 the new admin runs at `/admin-next` (its own Rails route and view); the old `/admin` is untouched.
- Cutover = `/admin` serves the new build, `/admin-next` is removed. The public site switches in one step at the end of Phase 3, after the visual check.

## 4. Local environment

- Add a `frontend` profile to `docker-compose.yml`: `node:24-slim`, pnpm via corepack, `node_modules` in a named volume, Vite dev server on port 5173, proxy target `http://web:3000`.
- Same local Mongo with the Atlas data copy as in UPGRADE_PLAN.md (confidential, kept outside the repo).
- `.nvmrc` / `engines` pin Node 24 for anyone working outside Docker.

## 5. Phases

### Phase 0 — Prerequisites
- [ ] Backend upgrade live (UPGRADE_PLAN.md definition of done + runbook completed).
- [ ] Branch `upgrade/frontend` from `master`.

### Phase 1 — Foundation and baseline
- [ ] **Visual baseline:** Playwright screenshots of every old public page (4 locales, desktop + mobile width) and every admin screen, taken against the local app with the data copy.
- [ ] Scaffold Vite + Vue + TS in `client/` next to the old sources (`src/app-next`, `src/admin-next`, `src/shared`); ESLint, Prettier, `vue-tsc`, Vitest, Playwright set up; `pnpm check` = typecheck + lint + unit tests.
- [ ] Tailwind 4 theme: colours, fonts, spacing and breakpoints taken from `style.css`, `portfolio.styl`, `sb-admin.css`.
- [ ] Shared API client, types, `$oid` normalizer, auth handling, i18n setup with migrated locale files.
- [ ] Rails: `vite_tags` helper, `/admin-next` route and view.
- [ ] Docker `frontend` profile.

### Phase 2 — Admin
- [ ] Login (no cookies), layout, sidebar, top menu, language selector, dashboard.
- [ ] CRUD screens: collections, products and images (upload by URL, make cover, delete), sizes, colors, social networkings, contact groups and contacts, sliders and slides.
- [ ] Data export and import.
- [ ] Component tests for forms and tables; Playwright end-to-end for login (201/404/401) and every create/edit/delete flow.
- [ ] Manual walkthrough on `/admin-next` with the data copy.
- [ ] **Cutover:** `/admin` → new build; remove `/admin-next`; change the admin password.

### Phase 3 — Public site
- [ ] Layout: header, main menu, mobile menu, footer, language selector, breadcrumb, loading states.
- [ ] Pages: home (slider, top products), collection list, accessories, collection, product (gallery, item details, extra fields), contacts (contact groups, contact form, social links).
- [ ] Rails meta tags, hreflang, real 404s (section 3.4); optional sitemap.
- [ ] Visual diff against the Phase 1 baseline: no unintended differences; deliberate changes listed.
- [ ] Lighthouse (mobile) before/after: no regressions in Performance, Accessibility, SEO.
- [ ] Link preview check for a product URL (e.g. Facebook Sharing Debugger).
- [ ] **Cutover:** `home#index` serves the new build.

### Phase 4 — Cleanup
- [ ] Remove AngularJS sources, webpack configs, old dependencies, `public/assets/{app,admin}`, `public/javascripts`, `public/i18n`.
- [ ] Rename `src/app-next` / `src/admin-next` to `src/app` / `src/admin`.
- [ ] Remove rack-cors if the Vite proxy has made it unnecessary.
- [ ] `README.md`: frontend dev, build and commit steps.

## 6. Definition of done

- [ ] `pnpm check` and Playwright end-to-end tests pass.
- [ ] Visual diff reviewed; only listed, intentional differences.
- [ ] No `$oid`, jQuery, lodash or AngularJS references left in `client/`.
- [ ] HTML shell has correct meta tags and hreflang for home, a collection and a product in all 4 locales; unknown slugs return 404.
- [ ] Admin password changed; no credential cookies are set.
- [ ] Build output and manifest committed; production boots and serves both apps with the Ruby buildpack only.
- [ ] Final pinned versions recorded in section 2.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Visual drift while recreating Bootstrap 3 styles in Tailwind | Playwright baseline + visual diff, page by page |
| ui-grid behaviours (sorting, inline actions, published toggle) missed in the PrimeVue DataTable | List the features per grid before porting; end-to-end tests for each grid |
| Forgetting to commit a fresh build after a source change | `pnpm build` in the same commit; check that the manifest's entry files exist before deploy |
| Translation interpolation differences | Automated conversion + test that renders every key in all 4 locales |
| Meta-tag lookup adds DB queries to the HTML shell | One lightweight query per request; only fields needed for meta tags |

## 8. Out of scope
- Simplifying the API (`$oid` → plain id) — possible follow-up once both frontends are replaced.
- Full server rendering (Nuxt) or Hotwire.
- A redesign.
- Vue Vapor mode (still a release candidate).
