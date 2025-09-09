# Superhero Backend API

Express + MongoDB backend for managing superheroes, teams, favorites, and authentication. Includes robust validation (Joi + Mongoose), JWT-based auth, caching, rate limiting, and Docker support.

## Features

- Authentication
  - Register/Login with JWT issuance
  - Joi request validation + Mongoose schema validation and unique email index
  - `GET /api/auth/me` to fetch the current user
- Heroes
  - List/search heroes with pagination
  - Get single hero with simple in-memory caching
  - Protected update endpoint prepared for role-based control
- Teams
  - Recommend teams via three strategies: Balanced, Power-focused, Random
  - Power-focused returns varied but top-powered heroes on refresh
  - Compare two teams by aggregate powerstats
- Favorites
  - Add/remove/list favorites for the authenticated user
- Security/ops
  - Helmet, CORS, morgan, express-rate-limit
  - ESLint (flat config) and lint scripts
  - Docker Compose with Mongo healthcheck and restart policies

## Tech Stack

- Node.js, Express, JWT
- MongoDB with Mongoose
- Joi for request validation
- Docker, Docker Compose

## Environment Variables

Create a `.env` file (for local runs) with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/superteam
JWT_SECRET=super-secret-change-me
# Token for superhero API used by the seed script
SUPERHERO_API_TOKEN=your_api_token_here
# Comma-separated origins for CORS
CLIENT_ORIGIN=http://localhost:5173,http://localhost
```

## Installation (without Docker)

1) Install dependencies

```
npm install
```

2) Start MongoDB
- Ensure a local MongoDB instance is running at `mongodb://localhost:27017` (or update `MONGO_URI`).

3) Seed (optional, populates heroes)

```
npm run seed
```

4) Start the server (dev or prod)

```
# Development (nodemon)
npm run dev

# Production
npm run start
```

5) Health check

```
curl http://localhost:5000/api/health
```

## Running with Docker

Prerequisites: Docker and Docker Compose installed.

1) Set environment
- Ensure `SUPERHERO_API_TOKEN` is set in your shell if you plan to run the seed script inside the container later.

2) Start services

```
docker compose up -d --build
```

- Services
  - `mongo`: MongoDB 6 with a named volume and healthcheck
  - `server`: Node server, waits until Mongo is healthy, restarts on failure

3) Logs

```
docker compose logs -f server
```

4) Seed Data

```
npm run seed
```

5) Stop

```
docker compose down
```

## API Overview

Base URL: `http://localhost:5000/api/health`

- Auth
  - POST `/auth/register` { email, name, password }
  - POST `/auth/login` { email, password }
  - GET `/auth/me` (Authorization: Bearer <token>)
- Heroes
  - GET `/heroes` query: `q`, `page`, `limit`
  - GET `/heroes/:id`
  - PATCH `/heroes/:id` (requires role middleware wiring on route; example in controller)
- Teams
  - GET `/teams/recommend` query: `type` one of `balanced|power|random`, `stat`, `size`
  - POST `/teams/compare` body: `{ teamA: string[], teamB: string[] }`
- Favorites
  - GET `/favorites` (auth)
  - POST `/favorites/:heroId` (auth)
  - DELETE `/favorites/:heroId` (auth)

### Example: Register and use token

```
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"bruce@wayne.com","name":"Bruce Wayne","password":"P@ssw0rd!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"bruce@wayne.com","password":"P@ssw0rd!"}'

# Me
curl http://localhost:5000/api/auth/me \
  -H 'Authorization: Bearer <token>'
```

## Validation

- Request-level (Joi) in `src/middleware/validators.js`
  - Register: email, name, password rules (8–64 chars, upper/lowercase, digit, special)
  - Login: email and password required
- Database-level (Mongoose) in `src/models/User.js`
  - Email format and length, name constraints, `unique` index for `email`
  - Duplicate-key and validation errors handled in `auth.controller.js`

## Project Scripts

- `npm run dev` — run with nodemon
- `npm run start` — run server
- `npm run seed` — import heroes using the Superhero API token
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix where possible

## Rate Limiting and Security

- `helmet()` for common headers
- `cors()` origins from `CLIENT_ORIGIN`
- `express-rate-limit` default: window 60s, max 120 requests

## File Structure

```
src/
  controllers/
  lib/
  middleware/
  models/
  routes/
  scripts/
```

Key files:
- `src/index.js` — app entry, middlewares, routes
- `src/middleware/validators.js` — Joi request validation
- `src/models/User.js` — schema and password helpers
- `src/controllers/auth.controller.js` — auth flows and error handling
- `src/lib/recommend.js` — team recommendation logic

## Docker Compose Notes

- Adds Mongo healthcheck and waits before starting the server
- `restart: unless-stopped` configured
- Change `CLIENT_ORIGIN`, `JWT_SECRET`, and `MONGO_URI` as needed for your environment

## Troubleshooting

- Port already in use: change `PORT` in `.env` and/or compose file
- Mongo duplicates when adding unique index: remove duplicates, then create index
- Joi/ESLint dependency conflicts: use `--legacy-peer-deps` when installing or update versions

## License

MIT
