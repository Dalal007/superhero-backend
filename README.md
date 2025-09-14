# Superhero Backend API

Express + MongoDB backend for managing superheroes, teams, favorites, and authentication. Includes robust validation (Joi + Mongoose), JWT-based auth, caching, rate limiting, comprehensive logging, and Docker support.

## Features

### Authentication & Authorization
- **User Registration/Login** with JWT token issuance (7-day expiration)
- **Role-based Access Control** with three levels: `viewer`, `editor`, `admin`
- **Joi request validation** + Mongoose schema validation with unique email index
- **Password security** with bcrypt hashing and strong password requirements
- **JWT middleware** for protected routes with role-based restrictions
- **User profile endpoint** (`GET /api/auth/me`) to fetch current user data

### Heroes Management
- **List/Search heroes** with pagination, filtering, and sorting
- **Get single hero** with detailed information including powerstats, biography, appearance
- **In-memory caching** (5-minute TTL) for improved performance
- **Role-based hero updates** (editors/admins only) with validation
- **Audit trail** tracking who last updated each hero and when
- **Comprehensive hero data** including powerstats, biography, appearance, work, connections

### Team Recommendations & Analysis
- **Three team recommendation strategies:**
  - **Balanced**: Mix of good, bad, and neutral alignment heroes
  - **Power-focused**: Top heroes in specific powerstat categories
  - **Random**: Completely random team selection
- **Team comparison** with aggregate powerstats analysis
- **Configurable team size** and powerstat focus
- **Detailed comparison results** with winner determination

### User Favorites System
- **Add/remove favorites** for authenticated users
- **List user favorites** with populated hero data
- **Duplicate prevention** using MongoDB `$addToSet` operations
- **User-specific favorite management**

### Admin Panel
- **User management** with pagination, search, and filtering
- **Role management** for updating user permissions
- **User deletion** with safety checks (prevent self-deletion)
- **Admin-only access** with proper authorization

### Logging & Monitoring
- **Winston logging** with multiple transports (console + file)
- **Structured logging** with different levels (error, warn, info, debug)
- **Request/response tracking** for all API endpoints
- **Authentication/authorization logging** for security monitoring
- **Service-level logging** for debugging and performance monitoring
- **Log rotation** with separate error and combined log files
- **Development vs production** log level configuration

### Security & Performance
- **Helmet** for security headers
- **CORS** configuration with environment-based origins
- **Rate limiting** (120 requests per minute window)
- **Request validation** with Joi schemas
- **MongoDB connection** with error handling and retry logic
- **In-memory caching** for frequently accessed data
- **Input sanitization** and validation at multiple layers

### Development & Operations
- **ESLint** configuration with flat config format
- **Docker Compose** setup with MongoDB health checks
- **Database seeding** scripts for heroes and admin users
- **Environment-based configuration** with comprehensive .env support
- **Health check endpoint** for monitoring
- **Graceful error handling** throughout the application

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) with bcryptjs for password hashing
- **Validation**: Joi for request validation, Mongoose for schema validation
- **Logging**: Winston with console and file transports
- **Caching**: node-cache for in-memory caching
- **Security**: Helmet, CORS, express-rate-limit
- **Development**: ESLint, nodemon, Docker & Docker Compose
- **External APIs**: Superhero API for data seeding

## Environment Variables

Create a `.env` file (for local runs) with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/superteam

# Authentication
JWT_SECRET=super-secret-change-me

# External APIs
SUPERHERO_API_TOKEN=your_api_token_here

# CORS Configuration
CLIENT_ORIGIN=http://localhost:5173,http://localhost

# Logging (optional - defaults provided)
LOG_LEVEL=debug  # debug, info, warn, error
```

### Environment-Specific Notes

- **Development**: `NODE_ENV=development` enables debug logging and detailed error messages
- **Production**: `NODE_ENV=production` reduces log verbosity and enables production optimizations
- **Logging**: Winston automatically configures log levels based on `NODE_ENV`

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

Base URL: `http://localhost:5000/api`

### Authentication Endpoints
- `POST /auth/register` - Register new user
  - Body: `{ email, name, password }`
  - Returns: JWT token and user data
- `POST /auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: JWT token and user data
- `GET /auth/me` - Get current user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: User profile with favorites

### Heroes Endpoints
- `GET /heroes` - List heroes with pagination and search
  - Query params: `q` (search), `page`, `limit`
  - Returns: Paginated list of heroes
- `GET /heroes/:id` - Get single hero details
  - Returns: Complete hero information
- `PATCH /heroes/:id` - Update hero (Editor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Hero update data
  - Returns: Updated hero

### Team Endpoints
- `GET /teams/recommend` - Get team recommendations
  - Query params: `type` (balanced|power|random), `stat`, `size`
  - Returns: Recommended team of heroes
- `POST /teams/compare` - Compare two teams
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ teamA: [heroIds], teamB: [heroIds] }`
  - Returns: Team comparison results

### Favorites Endpoints
- `GET /favorites` - List user favorites
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of favorite heroes
- `POST /favorites` - Add hero to favorites
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ heroId }`
  - Returns: Success confirmation
- `DELETE /favorites/:heroId` - Remove hero from favorites
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success confirmation

### Admin Endpoints (Admin only)
- `GET /admin/users` - List all users with pagination
  - Query params: `page`, `limit`, `search`, `role`, `sortBy`, `sortOrder`
  - Returns: Paginated user list
- `PATCH /admin/users/:userId/role` - Update user role
  - Body: `{ role: "viewer"|"editor"|"admin" }`
  - Returns: Updated user data
- `DELETE /admin/users/:userId` - Delete user
  - Returns: Success confirmation

### Health Check
- `GET /health` - API health status
  - Returns: `{ ok: true }`

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

## Logging

The application uses Winston for comprehensive logging with the following features:

### Log Levels
- **Error**: System errors, database failures, critical issues
- **Warn**: Authentication failures, validation errors, business logic warnings
- **Info**: API requests, successful operations, system events
- **Debug**: Detailed debugging information, cache hits/misses, service operations

### Log Outputs
- **Console**: Colored output for development
- **File**: `logs/all.log` - All log levels
- **File**: `logs/error.log` - Error level only

### Log Configuration
- **Development**: Debug level logging with detailed information
- **Production**: Warning level and above for performance
- **Automatic rotation**: Log files are managed by Winston
- **Structured format**: Timestamp, level, and message for easy parsing

### What Gets Logged
- All API requests and responses
- Authentication and authorization events
- Database operations and cache performance
- Service-level operations and business logic
- Error handling and validation failures
- System startup and configuration

## Project Scripts

- `npm run dev` — Run with nodemon (development mode)
- `npm run start` — Run server (production mode)
- `npm run seed` — Import heroes using the Superhero API token
- `npm run seed:users` — Create admin user for testing
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Auto-fix ESLint issues where possible

## Rate Limiting and Security

- `helmet()` for common headers
- `cors()` origins from `CLIENT_ORIGIN`
- `express-rate-limit` default: window 60s, max 120 requests

## File Structure

```
src/
  controllers/          # API route handlers
    admin.controller.js    # Admin panel endpoints
    auth.controller.js     # Authentication endpoints
    favorite.controller.js # User favorites management
    hero.controller.js     # Hero CRUD operations
    team.controller.js     # Team recommendations & comparison
  lib/                  # Core utilities
    cache.js              # In-memory caching configuration
    db.js                 # MongoDB connection setup
    logger.js             # Winston logging configuration
    recommend.js          # Team recommendation algorithms
  middleware/           # Express middleware
    auth.js               # JWT authentication & authorization
    validators.js         # Joi request validation schemas
  models/               # Mongoose schemas
    Hero.js               # Hero data model
    User.js               # User data model with authentication
  repositories/         # Data access layer
    hero.repository.js    # Hero database operations
    user.repository.js    # User database operations
  routes/               # Express route definitions
    admin.routes.js       # Admin panel routes
    auth.routes.js        # Authentication routes
    favorite.routes.js    # Favorites routes
    hero.routes.js        # Hero routes
    team.routes.js        # Team routes
  scripts/              # Utility scripts
    seed.js               # Hero data seeding
    seedUsers.js          # Admin user creation
  services/             # Business logic layer
    auth.service.js       # Authentication business logic
    favorite.service.js   # Favorites business logic
    hero.service.js       # Hero business logic
    team.service.js       # Team business logic
  index.js              # Application entry point
logs/                   # Log files (gitignored)
  all.log                # All log levels
  error.log              # Error level only
```

### Key Files
- `src/index.js` — Application entry point, middleware setup, route mounting
- `src/lib/logger.js` — Winston logging configuration with multiple transports
- `src/middleware/auth.js` — JWT authentication and role-based authorization
- `src/middleware/validators.js` — Joi request validation schemas
- `src/models/User.js` — User schema with password hashing and validation
- `src/models/Hero.js` — Hero schema with comprehensive superhero data
- `src/controllers/auth.controller.js` — Authentication flows and error handling
- `src/lib/recommend.js` — Team recommendation algorithms and comparison logic
- `src/services/` — Business logic layer separating concerns from controllers

## Docker Compose Notes

- Adds Mongo healthcheck and waits before starting the server
- `restart: unless-stopped` configured
- Change `CLIENT_ORIGIN`, `JWT_SECRET`, and `MONGO_URI` as needed for your environment

## Troubleshooting

### Common Issues

**Port already in use**
- Change `PORT` in `.env` and/or Docker Compose file
- Check if another process is using the port: `lsof -i :5000`

**MongoDB connection issues**
- Ensure MongoDB is running and accessible
- Check `MONGO_URI` in `.env` file
- Verify network connectivity to MongoDB instance

**Authentication problems**
- Verify `JWT_SECRET` is set and consistent
- Check token expiration (default: 7 days)
- Ensure proper Authorization header format: `Bearer <token>`

**Logging issues**
- Check `logs/` directory permissions
- Verify `NODE_ENV` setting for appropriate log levels
- Review `logs/error.log` for detailed error information

**Database seeding problems**
- Ensure `SUPERHERO_API_TOKEN` is valid and has quota
- Check MongoDB connection before running seed scripts
- Verify network access to Superhero API

**Docker issues**
- Ensure Docker and Docker Compose are installed
- Check container logs: `docker compose logs -f server`
- Verify MongoDB health check: `docker compose ps`

### Debugging with Logs

The application provides comprehensive logging for debugging:

```bash
# View all logs
tail -f logs/all.log

# View only errors
tail -f logs/error.log

# Filter logs by level
grep "ERROR" logs/all.log
grep "WARN" logs/all.log
```

### Performance Monitoring

- Monitor cache hit rates in debug logs
- Check database query performance in service logs
- Review rate limiting warnings in application logs

## License

MIT
