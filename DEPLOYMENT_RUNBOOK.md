# Deployment Runbook — Zlata (zlata-weddingfashion.com)

_Last updated: 2026-10-31. Decisions and target versions live in [UPGRADE_PLAN.md](UPGRADE_PLAN.md)._

**Start condition:** the [definition of done](UPGRADE_PLAN.md#6-definition-of-done--ready-to-deploy) in the upgrade plan is met on branch `upgrade/rails-8`.

**Approach:** deploy the upgraded app to a **new Heroku app** (classic Ruby buildpack, stack **heroku-26**) next to the current one, verify it on its `*.herokuapp.com` URL against a test database, switch it to the production database, then **move the domain**. The old app stays untouched as the rollback.

## 1. Current production

### Heroku app `zlata`
| Item | Value |
|---|---|
| Stack | **heroku-16**: retired 2021, no longer selectable. **The app can't be rebuilt; only the 2020 slug keeps running** |
| Build | `heroku/ruby` buildpack, no `Procfile` |
| Release | v48 = `76f90b8` (2020-10-21) |
| Dynos | 1 × web, **Basic ($7/mo)**, region `us`; no add-ons, no pipeline |
| Domain / TLS | `zlata-weddingfashion.com` (apex `ALIAS` → `*.herokudns.com`), ACM Let's Encrypt certificate |
| Config vars | `DB_URI`, `SECRET_KEY_BASE`, `gmail_username`, `gmail_password`, `to_email`, `RAILS_ENV`, `RACK_ENV`, `RAILS_SERVE_STATIC_FILES`, `LANG` |
| Logs | Router lines only; app logs go to an ephemeral file and are lost |
| Account | Personal Heroku account, 1 collaborator |

### Database
MongoDB Atlas, Free/M0, MongoDB **8.0.34**, AWS, 1 region, ~425 KB. Connected via `DB_URI` (SRV URI with credentials). The DB name `heroku_…` suggests it was moved from mLab.

### Emergency fallback before cutover
Until cutover, production can't be redeployed. If an urgent fix is ever needed, the only option is a one-off Docker image pushed via Heroku's container registry (`heroku stack:set container`, `heroku container:push web`, `heroku container:release web`; build with `--platform linux/amd64 --provenance=false`). Not planned; listed for completeness.

## 2. Hosting options and costs

All Cedar options cost the same per dyno (Heroku list prices, 2026).

| Option | Monthly | Notes |
|---|---|---|
| **Classic buildpack (chosen)** | **$7** (Basic) | Heroku maintains the OS layer; needs Ruby ≥ 3.1 |
| Cloud Native Buildpacks on Cedar | $7 | Same Ruby requirement; no benefit for us now |
| Docker (`heroku.yml` / container registry) | $7 | We'd have to maintain the OS layer ourselves; not needed after the upgrade |
| Fir | from $25/dyno + Private Space | Needs an Enterprise contract |

| Item | Cost |
|---|---|
| Current | 1 × Basic = **$7/month** |
| During transition (both apps) | + about $0.01/hour, **~$2–4** for 2–4 weeks |
| After cutover | **$7/month** |
| MongoDB Atlas M0 | free (512 MB limit; using < 1 MB) |

## 3. Prerequisites
- [ ] **New Heroku app name** chosen (e.g. `zlata-v2`).
- [ ] **DNS provider access** for `zlata-weddingfashion.com` (apex `ALIAS`/`ANAME` record); current TTL known.
- [ ] OK to create a **test database** in the Atlas M0 cluster (e.g. `zlata_test`).
- [ ] Atlas **network access** list confirmed: Heroku dynos have dynamic IPs, so access must stay open (e.g. `0.0.0.0/0`). The current app already connects, so it probably is.
- [ ] Fresh **`mongodump` backup** of production taken and stored outside the repo. Atlas M0 has no automatic backups, as far as I know; verify.
- [ ] Heroku CLI logged in with access to `zlata`.

## 4. Environment variables (new app)

| Variable | Source | Notes |
|---|---|---|
| `DB_URI` | copied → test DB first, then production | Atlas SRV URI with credentials |
| `SECRET_KEY_BASE` | copied | Signs JWTs |
| `gmail_username`, `gmail_password`, `to_email` | copied | Mail delivery checked separately |
| `RAILS_ENV`, `RACK_ENV` | copied | `production` |
| `LANG` | copied | `en_US.UTF-8` |
| `RAILS_MAX_THREADS`, `WEB_CONCURRENCY` | optional | Puma defaults |
| `RAILS_SERVE_STATIC_FILES` | **not copied** | No longer needed in Rails 8 |

Never print secret values in terminals, tickets or docs.

## 5. Steps

### 5.1 Create the app
- [ ] `heroku create <new-app> --stack heroku-26 --region us`
- [ ] `heroku buildpacks:set heroku/ruby -a <new-app>`
- [ ] Dyno type Basic: `heroku ps:type web=basic -a <new-app>` (after the first deploy).

### 5.2 Configure
- [ ] Copy config vars from `zlata` **without printing them**: a small script reads `heroku config --json -a zlata`, drops `RAILS_SERVE_STATIC_FILES`, and passes the rest to `heroku config:set -a <new-app>`.
- [ ] Restore the backup into the test database: `mongorestore --nsFrom 'heroku_…*' --nsTo 'zlata_test.*'`, run via the `mongo:8.0.34` image with the URI from an env var.
- [ ] Point the new app's `DB_URI` at the test database.

### 5.3 Deploy and verify (test database)
- [ ] `git remote add heroku-new https://git.heroku.com/<new-app>.git`
- [ ] `git push heroku-new upgrade/rails-8:main`. Check the build log: Ruby version, no Node install, no `assets:precompile`.
- [ ] `heroku run rails db:mongoid:create_indexes -a <new-app>`
- [ ] Run the snapshot script against `https://<new-app>.herokuapp.com`; the diff must be empty.
- [ ] Admin walkthrough on the new app: log in, create/edit/delete for every entity, data export.
- [ ] `heroku logs --tail -a <new-app>`: app logs visible, no errors. Check memory on the Basic dyno (512 MB).

### 5.4 Switch to the production database
- [ ] Set the new app's `DB_URI` to the production database.
- [ ] `heroku run rails db:mongoid:create_indexes -a <new-app>` (safe to repeat).
- [ ] Repeat the **read-only** checks: snapshot script, public site in 4 locales, admin login. Don't make test edits.

### 5.5 Domain cutover
1. One day before: lower the DNS TTL of the apex record. Take a fresh `mongodump`.
2. Freeze admin edits during the window.
3. `heroku domains:remove zlata-weddingfashion.com -a zlata`
4. `heroku domains:add zlata-weddingfashion.com -a <new-app>` → note the **new DNS target**.
5. Update the `ALIAS`/`ANAME` record at the DNS provider.
6. `heroku certs:auto:enable -a <new-app>`, then wait for "Cert issued" (`heroku certs:auto -a <new-app>`).
7. Verify the site, HTTP→HTTPS redirect, HSTS, admin login, contact form (if Gmail works), and logs.

Expected impact: a few minutes of errors or certificate warnings between steps 3 and 6, depending on DNS propagation.

## 6. Rollback
The old app `zlata` stays untouched (still heroku-16, still running the 2020 slug). **Don't change its stack.**
1. `heroku domains:remove zlata-weddingfashion.com -a <new-app>`
2. `heroku domains:add zlata-weddingfashion.com -a zlata` → note the DNS target it returns.
3. Point the DNS record to that target.
4. Wait for the certificate on `zlata` (`heroku certs:auto -a zlata`).

Data written through the new app stays in the shared production database. That's fine, because both apps use the same schema; the new app returns the same JSON.

## 7. Decommission
- [ ] After about 2 weeks of stable operation: `heroku ps:scale web=0 -a zlata`.
- [ ] Once agreed: `heroku apps:destroy zlata`. Keep the final DB dump.
- [ ] Drop the Atlas test database `zlata_test`.
- [ ] Merge `upgrade/rails-8` into `master`; remove the `heroku-new` remote name or rename it to `heroku`.
- [ ] Delete local DB dumps that are no longer needed.

## 8. Deployment risks

| Risk | Mitigation |
|---|---|
| heroku-26 problem at build or runtime | Fallback: `heroku stack:set heroku-24 -a <new-app>` and redeploy |
| Testing changes live content | Test database until step 5.4; read-only checks after that |
| DNS cutover downtime | Low TTL beforehand, short window, rollback path |
| Domain can't be on two apps at once | Steps 3–6 done back-to-back; rollback mirrors them |
| Atlas M0 has no automatic backups (verify) | Manual `mongodump` before cutover |
| Secrets leaking during config copy | Script copies values without printing them |
