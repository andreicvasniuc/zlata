# zlata

Website of Zlata Wedding Fashion (zlata-weddingfashion.com): a Rails JSON API plus a Vue 3 frontend (public site and admin), whose build output is committed to `public/build/`. Data is stored in MongoDB.

| | |
|---|---|
| Ruby / Rails | 4.0.9 / 8.1 (API mode; `HomeController` serves the HTML shells of the two Vue apps) |
| Database | MongoDB 8.0 (Mongoid 9). Production: MongoDB Atlas |
| Auth | JWT (`AuthToken`), `POST /user_token` |
| Hosting | Heroku, classic Ruby buildpack (`Procfile`). Docker is for local use only |
| Frontend | `client/` (Vue 3, TypeScript, Vite, Tailwind, PrimeVue for the admin). Its build output is **committed** to `public/build/`; Heroku does not build it (see [Frontend](#frontend)) |

Planning and deployment documents: [UPGRADE_PLAN.md](UPGRADE_PLAN.md), [FRONTEND_UPGRADE_PLAN.md](FRONTEND_UPGRADE_PLAN.md), [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md).

## Local development (Docker)

Requires Docker Desktop. Nothing else (Ruby, MongoDB) has to be installed.

```powershell
docker compose run --rm web bundle install   # first time only; gems live in the `bundle` volume
docker compose up -d
```

| Service | URL | |
|---|---|---|
| `web` | http://localhost:3000 | Rails in development; serves the committed build from `public/build/`; admin at `/admin` |
| `mongoku` | http://localhost:3100 | data viewer, already connected to `mongo` |
| `mongo` | `mongodb://localhost:27017` | database files in `./mongo-data` (gitignored), kept across `stop`/`start`/`down` |

Create an admin user (the admin login uses `User` records):

```powershell
docker compose run --rm web bin/rails runner 'User.create!(email: "you@example.com", password: "choose-one", is_admin: true)'
```

Copy `.env.example` to `.env` to set `to_email`, `gmail_username` and `gmail_password` for the contact form (`.env` is gitignored).

### Data

Take a dump of production (read-only) and keep it **outside the repo**: it contains the admin email and password hash.

```powershell
heroku login
$env:DB_URI = heroku config:get DB_URI -a zlata
docker run --rm -e DB_URI -v C:\Zlata\_dumps:/dump mongo:8.0.34 sh -c 'mongodump --uri="$DB_URI" --archive=/dump/zlata-prod.archive.gz --gzip'
$env:DB_URI = $null
```

Restore it into the local database (this replaces the local `ishop` collections):

```powershell
docker run --rm --network zlata_default -v C:\Zlata\_dumps:/dump mongo:8.0.34 mongorestore --host mongo --archive=/dump/zlata-prod.archive.gz --gzip --nsFrom '$db$.$col$' --nsTo 'ishop.$col$' --drop
```

The production Atlas user can only access its own database, so a dump can't be restored into another database on that cluster (for example a test copy). Restore locally, as above, or create a separate Atlas user for that database.

To start over with an empty database: `docker compose down`, delete `./mongo-data`, `docker compose up -d`.

### Tests

Request specs (RSpec) cover the public API, every admin endpoint, auth, data export/import and the contact form. They use the `ishop_test` database, which is purged on every run.

```powershell
docker compose run --rm -e RAILS_ENV=test web bundle exec rspec
```

The specs also cover the HTML shells (meta tags, hreflang, 404 for unknown collections and products, `sitemap.xml`) and check that every file named in the committed build manifest exists. Frontend tests are described under [Frontend](#frontend).

## Frontend

`client/` is one Vite project with two entries: the public site (`src/app`) and the admin (`src/admin`), sharing `src/shared` (typed API client, `$oid` → `id` normalizer, session, i18n, locale files, theme). Requires Node 24 and pnpm (version pinned by `packageManager`; `corepack enable` installs it).

How it reaches the browser: `pnpm build` writes `public/build/` (hashed files plus `.vite/manifest.json`). `HomeController` renders the HTML shell and the `vite_tags` helper reads the manifest to add the script, CSS and preload tags. Rails also puts the per-page title, description, Open Graph tags, canonical URL and hreflang links into the public shell, and answers 404 for unknown or unpublished collections and products.

### Develop

```powershell
cd client
pnpm install
pnpm dev          # http://localhost:5173, proxies the API to Rails on http://localhost:3000
```

With Rails running (`docker compose up -d`), the public site is at http://localhost:5173/ and the admin at http://localhost:5173/admin. Set `VITE_PROXY_TARGET` to proxy somewhere else. The same dev server runs in Docker with `docker compose --profile frontend up`.

### Checks

```powershell
pnpm check        # type check (vue-tsc), eslint, Vitest unit and component tests
pnpm test:e2e     # Playwright, against the dev server and Rails with local data
```

The Playwright specs create and delete data in the local database (names start with `e2e-`) and need an admin token: `$env:E2E_ADMIN_TOKEN = docker compose exec -T web bin/rails runner 'puts AuthToken.issue(User.first)'` (valid one day; never commit it). The login test that expects a 201 runs only when `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` are set. Install the browser once with `pnpm exec playwright install chromium`.

### Build and commit

Heroku uses the Ruby buildpack only, so the build output must be committed. Build in the same commit as the source change:

```powershell
cd client
pnpm build        # type check, then writes ../public/build (the folder is emptied first)
git add -A ../public/build
```

Without a matching build, production serves the previous version. If `public/build/.vite/manifest.json` is missing or names a file that isn't there, pages fail with a 500 (`ViteHelper::MissingEntry`); the Rails specs catch the second case.

## Production-like run (Docker)

Runs the app the way Heroku does (`RAILS_ENV=production`, no development gems, code copied into the image) with its own database. Separate from the development stack.

```powershell
.\up.ps1      # builds, starts mongo + mongoku + web, opens the links in the browser
.\down.ps1    # stops and removes the containers, keeps the data
```

| Service | URL |
|---|---|
| `web` | http://localhost:8080 (admin: http://localhost:8080/admin) |
| `mongoku` | http://localhost:3101 |
| `mongo` | `mongodb://localhost:27018`, files in `./mongo-data-prod` (gitignored) |

- If the database is empty, `up.ps1` restores the newest `*.archive.gz` from `..\_dumps` (`-DumpDir` to change it). `-NoBrowser` skips opening the links.
- `down.ps1 -RemoveData` also deletes `./mongo-data-prod`.
- Files: `docker-compose.prod.yml`, `Dockerfile.prod`. Locally the app runs with `FORCE_SSL=false`, because there is no TLS-terminating router (like Heroku's) in front of it.

## Configuration

| Variable | Used for |
|---|---|
| `DB_URI` | MongoDB connection string (production) |
| `SECRET_KEY_BASE` | Rails secret; also signs the admin JWTs |
| `RAILS_ENV`, `RACK_ENV`, `LANG` | `production`, `production`, `en_US.UTF-8` on Heroku. `RAILS_SERVE_STATIC_FILES` is no longer needed |
| `gmail_username`, `gmail_password`, `to_email` | Contact form email (Gmail SMTP) |
| `FORCE_SSL` | Set to `false` to disable the HTTPS redirect (local production runs only) |
| `MONGO_URI`, `MONGO_TEST_URI` | MongoDB for development and tests (set by `docker-compose.yml`) |

## Deployment

Heroku (stack heroku-26), classic Ruby buildpack, manual deploy. Commit a fresh `public/build/` before deploying (see [Build and commit](#build-and-commit)). The upgraded app runs as `zlata-weddingfashion`; the old `zlata` app (heroku-16, 2020 slug) stays as the rollback until decommissioned. The full procedure, cutover and rollback are in [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md).

```powershell
.\deploy.ps1                       # pushes develop to zlata-weddingfashion, asks for confirmation
.\deploy.ps1 -Yes                  # no confirmation
.\deploy.ps1 -Branch <branch> -App <app>
```

`deploy.ps1` authenticates with a Heroku API key, from `$env:HEROKU_API_KEY` or else the gitignored `.mcp.json` (`mcpServers.heroku.env.HEROKU_API_KEY`). The key is sent as an HTTP header for that one push, so there is no `heroku login`, no `heroku-new` remote and no stored git credential. It pushes the committed state of the branch (uncommitted changes are not deployed) and then prints the latest release. After the first deploy, run `heroku run rails db:mongoid:create_indexes -a zlata-weddingfashion` (safe to repeat).

Heroku's URL for the app carries a suffix (`https://zlata-weddingfashion-<suffix>.herokuapp.com`). `heroku apps:info -a zlata-weddingfashion` shows it.

## Checking the API against the old version

`script/api_snapshot.rb` records every API response (all locales, and the admin read endpoints when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set) so two versions can be compared on the same data. It was used to prove that the Rails 8 upgrade did not change the API output.

The old app (Ruby 2.7 / Rails 6.0) runs from a copy of the `master` branch, in a `baseline` container:

```powershell
# one time: a copy of the old code next to the repo, patched so that it bundles again
git -c core.autocrlf=false archive master | tar -x -C ..\zlata-baseline   # create the folder first
docker compose --profile baseline build baseline
docker run --rm -v "${PWD}\..\zlata-baseline:/app" -v "${PWD}\docker\prepare-baseline.sh:/prepare.sh:ro" -v zlata-baseline-bundle:/usr/local/bundle zlata-baseline sh /prepare.sh

# record both versions on the same local data, then compare
docker compose --profile baseline --profile production-check up -d baseline web_prod
docker compose --profile baseline --profile production-check run --rm -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... web ruby script/api_snapshot.rb snapshot http://baseline:3000 tmp/snapshots/baseline
docker compose --profile baseline --profile production-check run --rm -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... web ruby script/api_snapshot.rb snapshot http://web_prod:3000 tmp/snapshots/new
docker compose run --rm web ruby script/api_snapshot.rb compare tmp/snapshots/baseline tmp/snapshots/new
```

It also works against deployed apps, public endpoints only if no admin credentials are set: `ruby script/api_snapshot.rb snapshot https://<app>.herokuapp.com tmp/snapshots/<name>`. Comparing the old and new Heroku apps on production data gave 177 identical responses.

The same specs also run against the old app: `docker compose --profile baseline run --rm -e RAILS_ENV=test baseline bundle exec rspec --tag '~baseline_bug'`. The tag excludes the one spec that describes a defect of the old app (wrong password answered with 500, the new app answers 404).

## Layout

```
app/controllers/    public API (collections, products, ...), admin/ (secured), user_token, home (SPA shells), sitemaps
app/helpers/        vite_helper.rb (`vite_tags`: reads the Vite manifest)
app/models/         Mongoid models; admin/ models add locale handling for the admin API
app/services/       AuthToken (JWT), PageMeta (meta tags and status per public URL)
lib/                DataProcessor (admin data export/import), LocaleLooper
client/             Vue 3 source: src/app (public site), src/admin, src/shared; e2e/ (Playwright)
public/build/       committed Vite build output (do not edit by hand)
public/data/        import files used by the admin data import
spec/               request specs
script/             api_snapshot.rb
docker/             baseline image and prepare script
```
