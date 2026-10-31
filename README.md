# zlata

Website of Zlata Wedding Fashion (zlata-weddingfashion.com): a Rails JSON API plus the AngularJS frontend, whose build output is committed to `public/`. Data is stored in MongoDB.

| | |
|---|---|
| Ruby / Rails | 4.0.9 / 8.1 (API mode; `HomeController` serves the AngularJS shell) |
| Database | MongoDB 8.0 (Mongoid 9). Production: MongoDB Atlas |
| Auth | JWT (`AuthToken`), `POST /user_token` |
| Hosting | Heroku, classic Ruby buildpack (`Procfile`). Docker is for local use only |
| Frontend | `client/` (AngularJS, webpack). Its build output is committed to `public/` and not rebuilt by the Rails app |

Planning and deployment documents: [UPGRADE_PLAN.md](UPGRADE_PLAN.md), [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md).

## Local development (Docker)

Requires Docker Desktop. Nothing else (Ruby, MongoDB) has to be installed.

```powershell
docker compose run --rm web bundle install   # first time only; gems live in the `bundle` volume
docker compose up -d
```

| Service | URL | |
|---|---|---|
| `web` | http://localhost:3000 | Rails in development; admin at `/admin` |
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

Heroku (stack heroku-26), classic Ruby buildpack, manual `git push`. The upgraded app runs as `zlata-weddingfashion`; the old `zlata` app (heroku-16, 2020 slug) stays as the rollback until decommissioned. The full procedure, cutover and rollback are in [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md).

```powershell
git remote add heroku-new https://git.heroku.com/zlata-weddingfashion.git   # one time
git push heroku-new develop:main
heroku run rails db:mongoid:create_indexes -a zlata-weddingfashion          # after the first deploy; safe to repeat
```

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
app/controllers/    public API (collections, products, ...), admin/ (secured), user_token, home (SPA shell)
app/models/         Mongoid models; admin/ models add locale handling for the admin API
app/services/       AuthToken (JWT)
lib/                DataProcessor (admin data export/import), LocaleLooper
client/             AngularJS source; the committed build output is in public/
public/data/        import files used by the admin data import
spec/               request specs
script/             api_snapshot.rb
docker/             baseline image and prepare script
```
