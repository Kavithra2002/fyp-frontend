# FYP Forecast & XAI – Frontend

Next.js + TypeScript + shadcn UI for the forecasting and explainable AI platform (UC1–UC6).  
See `IMPLEMENTATION_SUMMARY.md` for what to implement and how it maps to your report.

## Getting Started

Install and run the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000). `/` redirects to `/dashboard`.

**Backend:** Set `NEXT_PUBLIC_API_URL` to your Node API (e.g. `http://localhost:4000/api`) or use the `rewrites` in `next.config.ts` to proxy `/api` to the backend. The `services/api.ts` client is wired for `/api/forecast`, `/api/explain`, `/api/scenario`, `/api/models`, `/api/data`, `/api/export`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
