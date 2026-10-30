# CineIT Authentication UI — Version 2

A distinct alternative to the first mockup. It keeps the black, charcoal and bright-green palette, but uses a centered authentication card, compact brand header, editorial welcome panel, and film-reel inspired decorative elements instead of the original split-screen booking panel.

## Files
- `index.html` — semantic page structure and login/register forms
- `styles.css` — responsive visual system
- `app.js` — form switching, password visibility, validation and API requests

## Run
Open `index.html` for a frontend preview. For real authentication, serve it through your application and implement the endpoints below.

## API contract
- `POST /api/auth/register` accepts `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login` accepts `{ "email": "...", "password": "..." }`

Return JSON such as `{ "message": "Account created" }`. Use non-2xx HTTP responses for errors with `{ "message": "Explanation" }`.

Set `API_BASE_URL` at the top of `app.js` if your backend is on a separate origin. Configure CORS appropriately.

## Security
- Do not connect browser JavaScript directly to SQL or expose database credentials.
- Hash passwords on the server with Argon2id or bcrypt. Never store plaintext passwords.
- Validate all fields on the server and use parameterized SQL queries.
- Use HTTPS, rate limiting and secure `HttpOnly`, `Secure`, `SameSite` session cookies in production.
- Replace placeholder links with real routes and policy pages.

## Suggested PR
**Title:** Create alternate CineIT authentication interface

**Summary:** Add a responsive login and registration interface using CineIT's black and green visual palette, with client-side validation, password visibility controls, and documented backend integration points.
