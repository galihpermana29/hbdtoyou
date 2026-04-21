# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Memoify (package name `xollet-fe`) — a Next.js 14 App Router frontend for creating and sharing "digital gifts, scrapbooks and albums" themed after Netflix/Spotify/YouTube/etc. The frontend talks to an external REST backend; there is no database layer inside this repo.

## Commands

- `npm run dev` — start the Next dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — `next lint`
- `npm run prepare` — Husky install (runs automatically)

No test runner is configured; there are no `test`/`spec` scripts.

Pre-commit (Husky + lint-staged, see `.husky/pre-commit` and `package.json`): runs `eslint src/` on staged `*.{js,jsx,ts,tsx}` files. Prettier config is enforced via editor — see `.prettierrc` (single quotes, semi, 2-space, trailing commas `es5`).

TypeScript is intentionally loose: `tsconfig.json` has `"strict": false` — do not rely on strict-null behavior when reading code. Path alias: `@/*` → `src/*`.

## Environment

All API wiring flips on `APP_ENV` / `NEXT_PUBLIC_APP_ENV`:

- `production` → uses `API_URI` (server) / `NEXT_PUBLIC_API_URI` (client)
- anything else (treated as staging) → `STAGING_API` / `NEXT_PUBLIC_STAGING_API`

This pattern is duplicated in `src/action/user-api.ts`, `src/action/client-api.ts`, and `src/lib/upload.ts`. When adding a new backend call, follow the same env-flip.

Other envs in use: `NEXT_PUBLIC_CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_GEMINI_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`, `SPOTIFY_CLIENT_ID/SECRET`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_POSTHOG_KEY/HOST`, `IS_MAINTENANCE`.

`IS_MAINTENANCE=true` short-circuits the home page (`src/app/page.tsx`) and `/create` to a maintenance screen. Check for this flag before assuming a route renders its real content.

## Architecture

### Routing layout (App Router with route groups)

- `src/app/(landing)/` — all public-facing routes. Subgroups:
  - `(core)/` — app features: `create`, `templates`, `preview`, `journal`, `inspiration`, `payment`, `photobox`, `career`, `contact`, `scrapbook`
  - `(gifts)/` — one directory per gift template (`netflixv1`, `spotifyv1`, `disneyplusv1`, `magazinev1`, `newspaperv1..v3`, `vinylv1`, `weddingv1`, `f1historyv1`). These are **viewer routes**, not creator routes — see below.
  - `(scrapbooks)/` — `scrapbook1`..`scrapbook8` variants plus shared `client-result.tsx` / `result-wrapper.tsx`
- `src/app/(dashboard)/dashboard/` — authenticated admin/user dashboard (templates, transactions, plans, coupons, feedbacks, brevo-usage, cloudinary-usage, scheduled, edit, view). Admin gating is a hard-coded email check in `dashboard/layout.tsx` (`memoify.live@gmail.com`).
- `src/app/api/` — Next API routes: `auth/[...nextauth]` (NextAuth + Google), `session` (reads iron-session), `generateSignature` (Cloudinary signed uploads), `upload` (server-side Cloudinary upload), `userData`, `top-10`.

### Creator → content record → viewer flow

This is the single most important thing to internalize:

1. **Creator** — `/create` (`src/app/(landing)/(core)/create/create-clientside.tsx`) is the only page that fills in a template. It holds a `templateComponents` dispatch map keyed by `selectedTemplate.route` (`netflixv1`, `spotifyv1`, `disneyplusv1`, `vinylv1`, …) pointing at the form components in `src/components/forms/new/new-*-form.tsx`. The same forms are reused by `/dashboard/edit/[id]` for editing.
2. **Content record** — the form submits via `src/action/*-api.ts` to the external backend, which stores a content row with a `detail_content_json_text` blob and returns an `id`.
3. **Viewer** — each `(gifts)/<template>/` directory has two entry points:
   - `page.tsx` at the template root is the **sample/preview** view. It renders the themed UI with placeholder data (e.g. `netflixv1/page.tsx` is `RootExamplePage` with `[null, null, ...]` arrays) and is what `/templates` and `/preview` link to.
   - `[id]/page.tsx` is the **real recipient viewer**. It calls `getDetailContent(id)` server-side, `JSON.parse`s `detail_content_json_text`, and renders the themed UI with the creator's actual data. The `[id]` is the backend content ID.

So when adding a new template variant you need four things in sync: a new `new-<name>-form.tsx` under `src/components/forms/new/`, an entry in the `templateComponents` map in `create-clientside.tsx`, a `(gifts)/<name>/page.tsx` preview, and a `(gifts)/<name>/[id]/page.tsx` dynamic viewer. The form filename and the viewer directory name are not directly coupled — they're both coupled to the template's `route` string on the backend.

### Data flow

- **Backend calls** live in `src/action/` as `'use server'` server actions (`user-api.ts` for auth/user/content/payments/dashboard, `spotify-api.ts`, plus `interfaces.ts` for types). Client-side mutations that need the caller's session go through `src/action/client-api.ts`, which fetches `/api/session` first and then hits the backend directly from the browser with the bearer token.
- **Sessions** use `iron-session` (`src/store/iron-session.ts` + `src/store/get-set-session.ts`). `getSession()` reads the cookie on the server; `setSessionSpecific` patches one key. The cookie is named `memoify-user-session` and the Spotify sub-session is stored under `session.spotify`. Note: the iron-session password is **hard-coded** in `iron-session.ts` — do not assume it's env-driven.
- **Client state**:
  - Redux Toolkit store (`src/lib/store.ts` + `uploadSlice.ts`) — only handles the upload-in-progress collection. Mounted inside `SessionProvider`.
  - TanStack Query (`src/app/query-provider.tsx`) — `refetchOnWindowFocus: false` by default.
  - `SessionProvider` (`src/app/session-provider.tsx`) is a client component that wraps the tree and exposes four hooks you should prefer over reading session directly: `useMemoifySession`, `useMemoifyProfile`, `useMemoifyUpgradePlan`, `useMemoifyUploadLoading`. It also owns the promotional ads modal and the Spotify-token refresh interval.
- **Root layout** (`src/app/layout.tsx`) prefetches the user profile server-side and passes it to `SessionProvider` as `initialProfileData`, avoiding a client round-trip on first paint.

### Uploads

Three coexisting paths — pick the right one:

1. `src/lib/upload.ts → uploadImageClientSide` — signed direct-to-Cloudinary upload. Uses `/api/generateSignature` (cloud `ddlus5qur`) and applies a `1.5` aspect-ratio crop for `type === 'free'`.
2. `src/app/api/upload/route.ts` — server-side Cloudinary upload to a **different** cloud (`dxuumohme`). Use only if you specifically need that cloud.
3. `src/lib/upload.ts → uploadImageWithApi / uploadMultipleImageWithApi / newUploadImageWithAPI` — forwards to the external backend's `/uploads` (or `/v2/uploads`).

### Integrations

- **Cloudinary** — see above. Remote image host for all generated content. `next.config.mjs` allows all `*.*` hosts and sets `images.unoptimized: true`.
- **Gemini** (`src/services/gemini.ts`) — generates the Netflix-style graduation narrative JSON; called from the graduation forms.
- **PostHog** — injected via `PostHogProvider` (`src/providers/`). `next.config.mjs` rewrites `/ingest/*` to PostHog to avoid ad-blockers; keep `skipTrailingSlashRedirect: true` in place.
- **NextAuth** — Google OAuth at `/api/auth/[...nextauth]`. On successful login, the app exchanges the Google identity via `loginOAuth` (`user-api.ts`) and stores the resulting backend token in iron-session.
- **Spotify** — separate OAuth scoped session stored under `session.spotify`, refreshed every 30 min by `SessionProvider`.
- **Remotion** (GIF/video export) — externalized in webpack (`next.config.mjs`) so the heavy renderer packages don't bundle. Feature-specific notes live in `GIF_EXPORT_README.md`, `VIDEO_EXPORT_README.md`, `VERCEL_OPTIMIZATION.md` (10-s Vercel Free timeout is the binding constraint), `LANDSCAPE_BOOK_FIX.md`, `SCRAPBOOK_LAYOUT_FIX.md`.

### UI stack

Three UI libraries coexist — match the surrounding file's convention rather than introducing a new one:

- **Ant Design 5** (`antd`) — primary for forms, modals, tables; wrapped in `AntdRegistry` in the root layout.
- **MUI 6** (`@mui/material`, `@mui/icons-material`) — used in parts of the landing.
- **shadcn/ui** — configured in `components.json` (style `new-york`, base color `zinc`, icon lib `lucide`). Generated components go under `src/components/ui/`.

Tailwind is configured in `tailwind.config.ts` (shadcn defaults + animate plugin). Global styles in `src/app/globals.css`.
