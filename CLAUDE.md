# CLAUDE.md

Guidance for working in this repository.

## What this is

Ecommerce storefront + admin for **VASSIA Candles & Scents** (hand-poured soy
candle brand). Next.js App Router · TypeScript · Tailwind v4 · Framer Motion ·
Prisma + **Neon Postgres** · **Vercel Blob** (product images) · Zustand,
deployed on **Vercel**. Currency is Moroccan Dirham (`DH`). No online card
payment — Cash on Delivery confirmed via WhatsApp.

## ⚠️ Critical: Windows path / npm

The real project path contains a space and `&`
(`…\VASSIA Candles & Scents\website`). `npm`/`npx` run scripts through
`cmd.exe`, which treats `&` as a command separator — **every `npm run` /
`npx` invocation fails from the real path** with a
`'…Scents\…' is not recognized` error.

A directory junction `C:\dev\vassia` → the real folder already exists.
**Run all npm/build/dev commands from `C:\dev\vassia`.** If a tool still
fails (npm resolves the real path internally), bypass the `.cmd` shims and
call the JS entrypoint directly with `node`, e.g.:

```
node ./node_modules/prisma/build/index.js generate
node ./node_modules/prisma/build/index.js db push --skip-generate
node ./node_modules/tsx/dist/cli.mjs prisma/seed.ts
node ./node_modules/next/dist/bin/next build
node ./node_modules/next/dist/bin/next dev
```

The logo script reads source PNGs from the **parent** of the project folder;
run it from the real path or the junction (both resolve the parent).

## Commands

- Setup: fill `.env` (Neon + Blob, see `.env.example`) → `npm install` →
  `npm run db:push` → `npm run db:seed` → `npm run logo`
- Dev: `npm run dev` (`:3000`)
- Build: `npm run build` · DB GUI: `npm run db:studio`
- There is no local SQLite. `db:push` / dev / studio all connect to Neon
  (use a Neon dev branch for local work if you don't want to touch prod).

## Architecture notes

- `app/(store)/` — storefront, wrapped by `(store)/layout.tsx` (Header,
  Footer, CartDrawer). `app/admin/(dashboard)/` — protected admin shell;
  `app/admin/login/` is public.
- Auth: `middleware.ts` guards `/admin/*` (except `/admin/login`) via a JWT
  cookie; `lib/auth.ts` (`isAdmin()`) re-checks server-side in the dashboard
  layout and every admin API route.
- **Order prices are recomputed server-side from the DB** in
  `app/api/orders/route.ts` — never trust client cart prices.
- Cart is a Zustand store persisted to `localStorage` (`lib/cart.ts`).
- Product `images` is a JSON-encoded string array (a single Postgres `text`
  column); use `parseImages()` / `lib/products.ts#toDTO` to read. Image
  uploads go to **Vercel Blob** via `app/api/admin/upload/route.ts` (needs
  `BLOB_READ_WRITE_TOKEN`); the stored value is the public blob URL.
- Prisma datasource uses `url` (Neon **pooled**, runtime) + `directUrl`
  (Neon **direct**, for `db push`). Both are set in `.env` / Vercel env.
- Design tokens (colors, fonts, eyebrow/btn/field classes, grain, candle
  glow) live in `app/globals.css` via Tailwind v4 `@theme`. Fonts:
  Cormorant Garamond (display) + Jost (sans), loaded in `app/layout.tsx`.

## Conventions

- Keep the editorial luxury aesthetic: serif display headings, wide
  letter-spaced `.eyebrow` labels, generous whitespace, restrained slow
  Framer Motion reveals (`components/Reveal.tsx`). No new fonts/colors
  outside the tokens.
- Prices are whole DH integers; format with `formatDH()` from `lib/format.ts`.
- After changing `prisma/schema.prisma`: `npm run db:push` (uses `DIRECT_URL`)
  then it regenerates the client. `postinstall` runs `prisma generate` so
  Vercel builds get a fresh client; the schema itself is pushed manually
  (run `npm run db:push` against Neon after a schema change — it is not part
  of the Vercel build).
- Deploy: push to the Vercel-connected repo. Set all `.env` vars in Vercel
  Project Settings; connect a Vercel Blob store (auto-injects
  `BLOB_READ_WRITE_TOKEN`). See README "Deploying to Vercel".
