# Frontend (Next.js dashboard)

## Quick start

1. Copy `.env.example` to `.env.local`.
2. Install packages: `npm install`
3. Run dev server: `npm run dev`

## Production-oriented auth flow

- Session uses backend-managed HttpOnly cookie (`fyp_auth`).
- API client sends `credentials: include`.
- Dashboard route access is checked server-side by `src/middleware.ts`.

## API setup

- Keep `NEXT_PUBLIC_API_URL=/api` for rewrite proxy.
- Set `BACKEND_API_URL` to backend base URL in each environment.

## Note

- Frontend no longer starts/stops backend processes through API routes.
- Start backend separately from terminal/infrastructure.
