# CineIT Backend Starter

Node.js + Express + MySQL authentication API for the CineIT frontend.

## 1. Before you start
Your project plan says a teammate has prepared SQL schema files. Ask for the merged `.sql` schema and confirm whether the team uses MySQL, MariaDB, PostgreSQL, or another database. This starter is configured for MySQL. Do not create a second users table if the team's schema already has one.

The authentication queries in `routes/auth.js` currently expect:
`users(id, full_name, email, password_hash)`.
Adapt those names to the team's actual schema before testing.

## 2. Requirements
Install Node.js 20 or newer and make sure your team's MySQL server is installed and running.

## 3. Install
From this folder run:
```bash
npm install
```

Copy `.env.example` to `.env` and fill in your actual DB settings. Generate a random JWT secret of at least 32 characters. Never commit `.env`.

## 4. Start
```bash
npm run dev
```
The API listens at `http://localhost:3000`.

Check `http://localhost:3000/api/health`. It should return database connected when the DB settings and server are correct.

## 5. Frontend
Serve the frontend with VS Code Live Server. Add the exact Live Server origin to `FRONTEND_ORIGIN` in `.env` (commonly `http://127.0.0.1:5500` or `http://localhost:5500`).

In frontend `app.js` set:
```js
const API_BASE_URL = "http://localhost:3000";
```
Keep `credentials: "include"` in fetch requests. Use the backend's `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me` endpoints.

## 6. Security notes
- Passwords are hashed using bcryptjs; plaintext passwords are never stored.
- SQL statements use placeholders.
- Session JWT is stored in an HttpOnly cookie.
- This is a development starter, not a complete production security review. Add CSRF protection and review cookie/CORS settings before deployment.
- Use HTTPS in production. Do not expose database credentials or JWT secrets in frontend code.
