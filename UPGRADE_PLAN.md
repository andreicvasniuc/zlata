# Upgrade Plan — Zlata (zlata-weddingfashion.com)

_Last updated: 2026-10-31. Based on a codebase review, read-only inspection of Heroku app `zlata`, and public package/compatibility data (RubyGems, MongoDB, Heroku Dev Center, endoflife.date)._

Deployment of the upgraded app is covered in [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md). That runbook starts once this plan's [definition of done](#6-definition-of-done--ready-to-deploy) is met.

## 0. Decisions

| Topic | Decision |
|---|---|
| Hosting | Stay on **Heroku**, Cedar generation, **classic Ruby buildpack**. **No Docker on Heroku** |
| Docker | **Local only**: development environment, building, and running the upgrade |
| Versions | **Latest stable** of everything (section 2), with a named fallback per component |
| Upgrade approach | **Direct jump**: fresh Rails 8.1 API skeleton, port the app code into it, guarded by snapshot and request tests |
| Rollout | **New Heroku app** next to the old one → verify → **move the domain**. Old app stays as rollback (see runbook) |
| Database | Keep **MongoDB Atlas** (Free/M0, MongoDB **8.0.34**, AWS, 1 region, ~425 KB) |
| Frontend | Keep the **committed build output**; no frontend rebuild. The API JSON format must stay identical |
| Deploys | Manual `git push` |
| Contact form | Keep Gmail SMTP; delivery checked separately |
| Ownership | Current personal Heroku account |

## 1. Current state of the application

- Ruby **2.7.1**, Rails **6.0.3.2** (`config.api_only = true`, module `IshopWeb`), Puma **4.3.5**, Mongoid **7.1.2**, mongo driver **2.13.0**, bson **4.10.0**, Knock **2.1.1** (JWT), logging-rails.
- **No tests** in the repo.
- AngularJS 1.8 frontend (`client/`, webpack 4). Its build output is committed to `public/assets`, `public/javascripts`, and the hashed file names are hard-coded in `app/views/home/*.html.erb`.
- Images are stored as ImgBB URLs in Mongo, so there is no file storage. MiniMagick image code in `lib/` is dead.
- `Gemfile.lock` contains **`mimemagic 0.3.5`, which was yanked from RubyGems**, so `bundle install` fails as it stands.
- `bin/*` and `config.ru` have **CRLF** line endings.
- Production runs an unbuildable 2020 slug on Heroku's retired heroku-16 stack (details in the runbook). Heroku's buildpack stacks offer only **Ruby 3.1+** (heroku-22/24) or **3.2+** (heroku-26), so **production can't be deployed again until this upgrade is done.**

## 2. Target versions (latest stable, checked 2026-10-31)

| Component | Now | **Target** | Maturity / support | Fallback |
|---|---|---|---|---|
| Ruby | 2.7.1 | **4.0.9** | 4.0 since Dec 2025; support until 2029-03. Officially supported by Mongoid 9.1 and mongo 2.26; available on Heroku. Rails 8.1 runs on it in other projects' CI, but there's no official Rails statement | **3.4.12** (until 2028-03) |
| Rails | 6.0.3.2 | **8.1.4** | Security fixes until 2027-10 (8.0 ends 2026-11-07) | — |
| Heroku stack | heroku-16 | **heroku-26** (Ubuntu 26.04, until 2031-04) | Supported; no known breaking changes vs 24; not the default yet | **heroku-24** (default, until 2029-04) |
| Mongoid | 7.1.2 | **9.1.1** | Includes security fixes (9.0.12/9.1.1); officially supports Ruby 4.0 and MongoDB 8.0; gemspec allows Rails < 8.2 | 9.0.12 |
| mongo (driver) | 2.13.0 | **2.26.0** | Fully compatible with MongoDB 8.0 and Ruby 4.0 | 2.25.0 |
| bson | 4.10.0 | **5.2.0** | Default for Mongoid 9. **Changes the ObjectId JSON format** (section 3.1) | — |
| mongoid-slug | 6.0.0 | **7.1.0** | Ruby 4.0 in its CI; Mongoid 9 allowed by the gemspec but not yet mentioned in its changelog | — |
| Puma | 4.3.5 | **8.0.2** | 8.0 line since Apr 2026 | 7.2.1 |
| Auth | knock 2.1.1 (abandoned) | **jwt 3.3.0** + small in-app service | Knock reads `Rails.application.secrets`, removed in Rails 7.2 | — |
| bcrypt | 3.1.15 | **3.1.22** | — | — |
| Nokogiri | 1.10.10 | **1.19.4** (via Rails) | — | — |
| rack-cors (dev only) | 1.1.1 | **3.0.0** | — | — |
| Logging | logging-rails 0.6.0 (abandoned) | **Rails logger → STDOUT** (Rails 8 default) | — | — |
| Removed | `bson_ext`, `sdoc`, `spring`, `jbuilder` (unused), `web-console`, `knock`, `logging*`, `mimemagic` | — | — | — |
| Local Ruby image | — | **`ruby:4.0.9-slim`** (Debian trixie) | Official image | `ruby:3.4.12-slim` |
| Local MongoDB | — | **`mongo:8.0.34`** | Same version as Atlas | — |

Rule: if a target fails in testing, switch to its fallback; the plan doesn't change otherwise.

## 3. Compatibility work required

### 3.1 Keep the API JSON identical
- The API returns IDs as `{"_id": {"$oid": "..."}}`. The committed frontend reads `$oid` in 6 files (`client/src/app/controllers/product`, `client/src/admin/services/{color,image,size}Service`, `product-editor-popup`), and so does `lib/data_processor.rb` (12 places).
- bson 5 returns a plain string, and Mongoid 9 removed the `object_id_as_json_oid` setting. → Add an initializer that restores `{"$oid" => to_s}` for `BSON::ObjectId#as_json`.
- Also verify: `_slugs`, timestamps format (`created_at` ISO8601 with ms), `nil` vs missing keys, localized fields (`name`, `description` for `en/ua/ru/ro`), custom `as_json` in `CollectionConcern` (`products_count`, `slug`).

### 3.2 Mongoid 7.1 → 9.1 behavior changes to cover with tests
- Embedded documents (product images, slides, contacts?): updating an embedded document now **automatically touches its parent**; `around_*` callbacks on embedded documents are ignored; embedded documents use the parent's persistence context.
- Changing `_id` on a persisted document raises an error. Check the image "make cover" and slug code.
- `upsert` no longer replaces by default; unchanged children aren't autosaved (`autosave_saves_unchanged_documents = false`).
- Removed config options must not appear; `config.load_defaults` ≥ 8.0; set a time zone.
- Regenerate `config/mongoid.yml` (`rails g mongoid:config`): production `uri: <%= ENV['DB_URI'] %>`, development `<%= ENV.fetch('MONGO_URI', 'mongodb://localhost:27017/ishop') %>`.
- Remove `Mongoid.load!` from `config/application.rb` (the Mongoid railtie loads config).

### 3.3 Replace Knock while keeping the contract the admin frontend uses
- `POST /user_token` with body `{"auth": {"email": ..., "password": ...}}` → **201** `{"jwt": "<token>"}`; invalid credentials → **404** (the login screen checks `status == 404`).
- Protected endpoints read `Authorization: Bearer <token>`; missing or invalid token → **401**.
- Token: HS256, signed with `SECRET_KEY_BASE`, `exp` = 1 day, `sub` = `user.id.to_s`. Existing admin sessions have to log in again once.
- `User` keeps `has_secure_password` (bcrypt); `password_digest` values stay valid.

### 3.4 Rails 6.0 → 8.1 changes for this app
- Generate the skeleton with `rails new zlata --api --skip-active-record --skip-active-storage --skip-action-cable --skip-action-mailbox --skip-action-text --skip-test --skip-kamal --skip-thruster --skip-solid --skip-docker --skip-git`. Keep Action Mailer, and keep the `bin/`, `config/` and `Gemfile` it generates.
- `HomeController` (renders `home/index.html.erb`, `home/admin.html.erb`) and `ApplicationController` stay on `ActionController::Base`; API mode is kept as today.
- `config/secrets.yml` → remove; Rails reads `SECRET_KEY_BASE` from ENV in production.
- Zeitwerk + `config.autoload_lib`: **delete dead code** first (`lib/image/`, `lib/*image*`, `lib/collection_image*`, `lib/product_image*`, `lib/iputs.rb`). Keep `lib/data_processor.rb`, `lib/locale_looper.rb`, `lib/exceptions/` and drop the `require Rails.root.join('lib', ...)` lines.
- Production config: `force_ssl` + `assume_ssl` (Heroku router), logs to STDOUT, static files served by Rails (`public/`), `i18n.fallbacks`, locales `[:ua, :ru, :ro, :en]` with `enforce_available_locales = false`, Gmail SMTP settings unchanged.
- Routes are ported as is (`scope '(:locale)'`, catch-all `get '*path'` routes last).
- Development: rack-cors for the webpack dev server (`localhost:8080`) as today.
- `Procfile`: `web: bundle exec puma -C config/puma.rb`.
- `Gemfile`: `ruby "4.0.9"`; `Gemfile.lock` must include `x86_64-linux`. The repo root has no `package.json`, so the Ruby buildpack won't install Node, and there's no asset pipeline, so no `assets:precompile`.
- `.gitattributes` forcing LF for `bin/*`, `*.rb`, `*.yml`, `Procfile`, Docker files.

## 4. Local Docker environment (development only)

- `Dockerfile.dev`: `ruby:4.0.9-slim` + `build-essential`, `git`, `libyaml-dev`. Gems go in a named volume; the source is bind-mounted.
- `docker-compose.yml`:
  - `web`: `bin/rails s -b 0.0.0.0`, port 3000, `MONGO_URI=mongodb://mongo:27017/ishop`, removes a stale `tmp/pids/server.pid`.
  - `mongo`: `mongo:8.0.34`, named volume.
  - optional `frontend` profile (Node + webpack dev server on 8080) for future frontend work.
- `.env.example` lists variable **names only**; `.env` is gitignored.
- **Baseline profile:** a second compose service runs the **current** app (Ruby 2.7.8, Rails 6.0.6.1 to get rid of the yanked `mimemagic`) against the same Mongo. It's the reference for the snapshot comparison.
- **Data:** `mongodump` from Atlas via the `mongo:8.0.34` image, with the URI passed through an env var from `heroku config:get DB_URI` and never printed. Store the archive **outside the repo** and treat it as confidential: it contains the admin user's email and password hash.
- Admin user for local work: `bin/rails runner 'User.create!(email: "...", password: "...", is_admin: true)'`.

## 5. Phases

### Phase 1 — Baseline and safety net
- [ ] Branch `upgrade/rails-8`. Add `.gitattributes`; renormalize line endings.
- [ ] Docker baseline: current app on Ruby 2.7.8 / Rails 6.0.6.1 runs against local `mongo:8.0.34` loaded with the Atlas dump.
- [ ] **API snapshots:** a script that GETs every public endpoint for each locale (`en/ua/ru/ro`, plus no locale), for every collection and product slug in the data, and saves normalized JSON. Run it against the baseline app; once, compare with production (read-only GETs) to confirm the baseline matches.
- [ ] **RSpec request specs** for admin endpoints: auth (201/404/401), collections, products, images (`upload` by URL, `make_cover`, `destroy`), sizes, colors, social networkings, contact groups/contacts, sliders/slides, data export/import, contact form (`send_form`, mail delivery `:test`).

### Phase 2 — New skeleton and port
- [ ] Generate the Rails 8.1.4 skeleton in the `ruby:4.0.9-slim` container (section 3.4); merge its `bin/`, `config/`, `Gemfile`, `config.ru`, `Rakefile` into the repo.
- [ ] Port `app/`, `lib/` (minus dead code), routes, locales, env-specific settings.
- [ ] Mongoid 9.1.1 config, `$oid` initializer, Mongoid 9 behavior fixes.
- [ ] Knock → jwt service (section 3.3).
- [ ] `Procfile`, `ruby "4.0.9"`, lockfile platform `x86_64-linux`.

### Phase 3 — Verification (local)
- [ ] All request specs green; **snapshot diff = empty** (new app vs baseline on the same data).
- [ ] Manual admin walkthrough in the browser (`/admin`) on the local data copy: create/edit/delete for every entity, image cover, slider, data export/import.
- [ ] Manual public site walkthrough in all 4 locales (desktop + mobile width).
- [ ] No deprecation warnings at boot or in specs.
- [ ] If a target version fails, apply its fallback (section 2) and re-run.

## 6. Definition of done = "ready to deploy"

The deployment runbook may start only when all of these are true on branch `upgrade/rails-8`:
- [ ] All request specs pass.
- [ ] Snapshot diff (new app vs baseline, same data) is empty for all locales.
- [ ] Manual admin and public walkthroughs done without issues.
- [ ] No deprecation warnings at boot or in specs.
- [ ] `Procfile` present; `Gemfile` has `ruby "4.0.9"` (or the fallback); `Gemfile.lock` includes `x86_64-linux`.
- [ ] `config/secrets.yml` removed; the app boots in production mode with only the env vars listed in the runbook.
- [ ] Final target versions (including any fallbacks used) recorded in section 2.
- [ ] `README.md` updated with the local Docker setup.

## 7. Upgrade risks

| Risk | Mitigation |
|---|---|
| No production deploys until the upgrade is done | Keep the branch short-lived; emergency Docker fallback is in the runbook |
| Mongoid 7→9 behavior changes break admin flows | Request specs + manual admin walkthrough on a data copy |
| JSON format drift breaks the committed frontend | `$oid` initializer + snapshot diff must be empty |
| Ruby 4.0 / mongoid-slug + Mongoid 9 not fully proven | Fallbacks: Ruby 3.4.12, Mongoid 9.0.12 |
| DB dump contains personal data | Kept outside the repo, not shared, deleted when no longer needed |

## 8. Findings to handle later (out of scope)
- **Security:** the admin login stores the admin's **email and plain-text password in browser cookies** (`client/src/admin/controllers/login/index.jsx`, `setCookies`). Remove this, and change the admin password afterwards. Needs a frontend rebuild. → Handled in [FRONTEND_UPGRADE_PLAN.md](FRONTEND_UPGRADE_PLAN.md) (section 3.2, Phase 2).
- Contact form: confirm Gmail delivery (needs an app password since 2022).
- Frontend: AngularJS 1.x, webpack 4 and Node 16 are EOL; the build is manual with hand-edited hashes. → Planned in [FRONTEND_UPGRADE_PLAN.md](FRONTEND_UPGRADE_PLAN.md).
- `sitemap.xml` returns 406; unknown paths return the SPA shell with 200 (SEO). → Handled in [FRONTEND_UPGRADE_PLAN.md](FRONTEND_UPGRADE_PLAN.md) (section 3.4, Phase 3).
