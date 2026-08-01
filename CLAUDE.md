# Storefront — Ground Truth

This repo is one of three independent repos in a larger workspace (`backed/`, `frontend_admin/`, `frontend_user/`). If your session root is the parent folder (`D:\ecommrce\`), read that root's `CLAUDE.md` and `docs/` first — it has the cross-repo context (architecture, DB schema, module catalog, ADRs, roadmap) this file doesn't repeat.

**Quick facts:** Next.js **15** (App Router — one major version behind `frontend_admin`'s Next 16, see `../docs/adr/0006-nextjs-version-mismatch.md`), React 19, TypeScript strict, Tailwind + shadcn/ui, Zustand (UI/session state) + TanStack Query (all server data). Run: `npm install && npm run dev` (see `.env.example`/`.env.local`).

**Read before editing:**
- `../docs/CONVENTIONS.md` and `../.claude/rules/frontend.md` — per-domain file pattern (service → hook → schema → page), image/`next/image` conventions, auth-token handling.
- `../docs/contracts/backend-api-surface.md` — which backend endpoints actually exist before building a page around one.
- `MODULES.md` (this repo) is an **older build plan, confirmed stale** — most of it is done, plus a whole Product Customization/Designer feature exists that isn't mentioned in it at all. Prefer `../docs/MODULES_CATALOG.md` for current status.
- `../docs/PROJECT_STATE.md` — uncommitted work in this repo right now (`next.config.ts`, `package.json`, an orders page — likely mid-flight customization-feature wiring).

⚠️ **Known production blocker in this repo:** `next.config.ts`'s `images.remotePatterns` is hardcoded to `localhost:3000` — will break every product/category/brand image in production until it's made env-driven (`../docs/ROADMAP.md` Phase 1).
