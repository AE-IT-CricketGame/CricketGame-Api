# MycricQ Backend (cricket-api)

Backend API and CMS for **MycricQ**, a cricket quiz game. Players answer questions worth 1, 2, 4 or 6 runs, scores go onto campaign leaderboards, and players join through a mobile subscription or the **FriMi** wallet.

It is built on **Strapi 5** (headless CMS) with **PostgreSQL**. Content managers add questions, campaigns and SMS templates in the Strapi admin panel. The game front end and the subscription provider call the REST API.

---

## Tech stack

| | Version |
|---|---|
| Node.js | 20 – 24 (developed on **24**) |
| Strapi | **5.58.0** |
| Database | PostgreSQL (`pg` driver) |
| HTTP client | axios (FriMi integration) |

---

## Getting started

### 1. Prerequisites
- Node.js 24 (`nvm install 24 && nvm use 24`)
- PostgreSQL running locally (or reachable remotely)

### 2. Create the database
```bash
createdb -U postgres cricket_db
```
Strapi creates all tables on first start.

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in the values (see [Environment variables](#environment-variables)). Generate each secret with:
```bash
openssl rand -base64 32
```
`APP_KEYS` takes a comma-separated list of 4 such values.

### 4. Install and run
```bash
npm install
npm run develop
```
- API: http://localhost:1337/api
- Admin panel: http://localhost:1337/admin (create the first admin user on first visit)

### 5. Allow API access
A fresh database blocks every endpoint (`403 Forbidden`). In the admin panel, go to **Settings → Users & Permissions → Roles → Public** (or **Authenticated**) and tick the actions the front end needs. For server-to-server callers, use **Settings → API Tokens** instead and send `Authorization: Bearer <token>`.

### Scripts
| Command | Description |
|---|---|
| `npm run develop` | Dev mode with auto-reload |
| `npm run build` | Build the admin panel |
| `npm run start` | Production mode (run `build` first) |
| `npm run strapi` | Strapi CLI |

---

## Environment variables

`.env` is git-ignored. Never commit real values.

### Server and security
| Variable | Description |
|---|---|
| `HOST` | Bind address, default `0.0.0.0` |
| `PORT` | Port, default `1337` |
| `APP_KEYS` | Session keys (comma-separated) |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | Admin panel JWT secret |
| `TRANSFER_TOKEN_SALT` | Salt for data transfer tokens |
| `ENCRYPTION_KEY` | Admin encryption key (new in Strapi 5) |
| `JWT_SECRET` | Users & Permissions JWT secret |

### Database
| Variable | Default |
|---|---|
| `DATABASE_CLIENT` | `sqlite` if unset, so set it to `postgres` |
| `DATABASE_HOST` | `127.0.0.1` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | `cricket_db` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | — |
| `DATABASE_SSL` | `false` |

Optional: `DATABASE_POOL_MIN`, `DATABASE_POOL_MAX`, `DATABASE_CONNECTION_TIMEOUT`.

### FriMi wallet
| Variable | Description |
|---|---|
| `FRIMI_API_URL` | OAuth2 token endpoint |
| `FRIMI_API_AUTHORIZATION` | `Authorization` header value for the token request |
| `FRIMI_CUSTOMER_DETAILS_URL` | Get lifestyle user (customer details) endpoint |
| `FRIMI_CUSTOMER_TRANSACTION_URL` | Payment transaction endpoint |
| `FRIMI_CUSTOMER_AMOUNT` | Amount charged per subscription (LKR) |
| `FRIMI_CUSTOMER_TID` | Terminal ID |
| `FRIMI_CUSTOMER_MID` | Merchant ID |
| `FRIMI_CUSTOMER_LID` | Lifestyle ID |

The FriMi endpoints fail until all eight are set. Get the values from the FriMi / Nations Trust Bank merchant team. UAT and production use different URLs and credentials.

---

## Content types

| Content type | Collection | Draft & publish | Purpose |
|---|---|---|---|
| **Question** | `questions` | ✅ | Quiz question: `question`, `answer_1`–`answer_4`, `correct_answer`, `runs` (`Run_1` / `Run_2` / `Run_4` / `Run_6`), `durations` (seconds) |
| **Campaign** | `campaigns` | ✅ | Tournament: `campaign_name`, `start_time`, `end_time`, `prize`, `wallpaper` (media), `rules` (repeatable `rules.rule` component), `matchSize`, has many leaderboards |
| **Leaderboard** | `leaderboards` | — | Player score in a campaign: `player`, `mobile`, `score` (string, e.g. `"3/5"`), `points`, `campaign` |
| **Payment** | `payments` | — | Subscription billing per mobile number: `mobile` (unique), `cycle`, `log`, `service_provider`, `serverRef`, `ipdated` |
| **Frimi-player** | `frimi_players` | — | FriMi wallet user: `wallet_id`, `username`, `mobile`, `nic`, `uuid`, `payment` (paid for the current period) |
| **SMS Template** | `sms_templates` | ✅ | SMS text (`sms`) |
| **Admin** | `admins` | ✅ | Log of `SUBSCRIBED` webhook payloads (`data`, JSON) |

Components: `rules.rule` (used by Campaign), plus `runs.1-run` and `runs.2-run` (currently unused).

> **Draft & publish:** Questions, campaigns and SMS templates are visible to the API only after they are **published** in the admin panel.

---

## API endpoints

Base URL: `/api`

### Standard REST
Strapi generates `find`, `findOne`, `create`, `update` and `delete` for these:

`/questions`, `/campaigns`, `/leaderboards`, `/payments`, `/sms-templates`, `/frimi-players`

Single records are addressed by **`documentId`**, for example `GET /api/campaigns/:documentId`. The default page limit is raised to 10,000 in [config/api.js](config/api.js).

### Game
| Method | Path | Description |
|---|---|---|
| `POST` | `/question/random/:runs?ids=1,2,3` | Returns one random **published** question for `runs` = `1`, `2`, `4` or `6`, skipping the question `id`s in `ids` (questions already shown) |
| `POST` | `/score/zero` | Resets every leaderboard score to `"0/0"` |
| `POST` | `/question/delete/:mobile` | Deletes all leaderboard entries for a mobile number. This is a leaderboard route despite the `question` in the path |

### Subscription and payments
| Method | Path | Description |
|---|---|---|
| `POST` | `/admin` | Subscription provider webhook. Body: `{ "msisdn": "9477…", "status": "SUBSCRIBED" \| "UNSUBSCRIBED" }`. `UNSUBSCRIBED` deletes the player's leaderboard rows (`94…` is converted to `0…`). `SUBSCRIBED` stores the payload in **Admin** |
| `POST` | `/payments/update?mobile=&cycle=&log=` | Updates `cycle` and `log` for a mobile number |
| `POST` | `/payments/delete/:mobile` | Deletes the payment record for a mobile number |
| `POST` | `/payments/cycle/delete` | Resets every payment's `cycle` to `0` and clears `log` |

### FriMi
| Method | Path | Description |
|---|---|---|
| `POST` | `/frimi-player/login` | Body: `{ "uuid": "…" }`. Fetches the customer from FriMi. Returns the existing player if the wallet is already registered; otherwise charges `FRIMI_CUSTOMER_AMOUNT` and saves the player with `payment: true`. Responses carry `tag: "FRIMI"` |
| `GET` | `/frimi-player/transaction` | Charges every player with `payment: false` and marks the successful ones `true`. Returns a per-wallet result list |
| `POST` | `/frimi-player/reset/payment` | Sets `payment: false` for all players (start of a new billing period) |
| `POST` | `/frimi-player/unsubscribe/:mobile` | Deletes the FriMi player with that mobile number |

These are meant to be scheduled together: `reset/payment` at the start of each period, then `transaction` to collect payments.

#### FriMi call flow
1. **Token:** `POST FRIMI_API_URL` (`grant_type=client_credentials`) returns an `access_token`.
2. **Customer details:** `GET FRIMI_CUSTOMER_DETAILS_URL?uuid&mid&lid` returns name, mobile, NIC and `wallet_id`.
3. **Transaction:** `POST FRIMI_CUSTOMER_TRANSACTION_URL` with the wallet, amount, currency (`144` = LKR), `tid`, `mid`, `lid`, a merchant ref (`MQxxxxx`) and a request ID. It succeeds when `response_description === "Success"`.

Every FriMi request sends the headers `channel: 2`, `version: 1`, `requestType: LS`, `languageCode: en`, plus a per-request `uuid` and `datetime`. They are defined in [constants.js](src/api/frimi-player/common/constants.js).

---

## Project structure

```
config/                 Server, database, admin, API and middleware config
database/migrations/    Custom DB migrations (none yet)
public/uploads/         Uploaded media (local provider)
src/
  index.js              register / bootstrap hooks
  components/           rules.rule, runs.*
  api/
    question/           random question endpoint
    campaign/
    leaderboard/        score reset, delete by mobile
    payment/            update, delete, cycle reset
    admin/              subscription webhook
    sms-template/
    frimi-player/
      controllers/      userlogin, usertransation, resetpayment, unsubscribe
      frimi-custom-api/ token, customer details, transaction (axios)
      database/         data access helpers (Document Service)
      common/           constants, ID generators
```

Each API follows the Strapi layout: `content-types/` (schema), `controllers/`, `routes/` and `services/`. Custom endpoints have their own route file (for example `routes/user-login.js`) pointing at a custom controller file.

---

## Strapi 5 upgrade notes

The project moved from **Strapi 4.7.1 / Node 18** to **Strapi 5.58 / Node 24**.

What changed in this codebase:
- `strapi.entityService.*` was replaced by the Document Service, `strapi.documents(uid).*`. Updates and deletes now use **`documentId`** (a string) instead of the numeric `id`.
- `@strapi/plugin-i18n` was removed (it is built into Strapi 5). `react`, `react-dom`, `react-router-dom` and `styled-components` are now required dependencies, and `axios` is now listed explicitly.
- The random question endpoint returns **published** questions only. Strapi 5 keeps a draft row and a published row for each question, so it filters on `publishedAt`.
- `ENCRYPTION_KEY` was added to [config/admin.js](config/admin.js).
- The leaderboard score reset no longer writes `log`, which is not a Leaderboard field and is rejected by Strapi 5.

**Impact on clients (game front end, admin tools):**
- **Response shape:** Strapi 5 returns flat objects. `data.attributes.question` becomes `data.question`, and each record now also includes `documentId`. Clients that haven't been updated can send the header `Strapi-Response-Format: v4` to get the old format during migration.
- Standard REST routes use `documentId` in the URL instead of `id`.

**Migrating an existing v4 database:** back it up first, then point `.env` at it and start the app. Strapi runs its v5 data migrations automatically on first boot. Test on a copy before production.

---

## Known issues / TODO

- `/admin` webhook: if `msisdn` doesn't start with `94`, the mobile number is left undefined before the delete query. Validate the input.
- `/frimi-player/login`: the payment is taken **before** the player is saved, so a failed save leaves a charged but unregistered user. Simultaneous logins can also charge twice.
- Merchant ref and request IDs are 5 random digits, so collisions are possible. Use a stronger unique ID.
- `/payments/update` returns 500 instead of 404 when the mobile number is not found.
- `/payments/cycle/delete` and `/score/zero` don't return a clean error response on failure.
- Custom endpoints have no input validation and rely only on role permissions. Lock them down before production (for example, API tokens for webhook and cron callers).
