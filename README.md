# Himnario Rayos de Esperanza

Progressive Web App (PWA) hymnbook for Iglesia de Dios en México. Browse, search, read, and favorite 406 hymns offline-friendly on mobile and desktop.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 11+

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Generate hymn JSON and build for production |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript without emitting |
| `pnpm test` | Run Jest unit tests |
| `pnpm test:e2e` | Run Playwright end-to-end tests |
| `pnpm generate:hymns` | Regenerate hymn JSON from XML source |

## Hymn content workflow

Source hymn files live in `docs/himnario/` (XML). To update hymn data after editing:

```bash
pnpm generate:hymns
```

This writes to `src/lib/hymns/generated-hymns.json` and `public/hymns.json`. Commit both files before deploying.

## PWA cache versioning

The service worker uses a cache name in `public/sw.js` (e.g. `himnario-v1`). **Bump the version** when deploying changes that affect cached assets so returning users receive fresh content.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` trigger CI and auto-deploy.

- Build command: `pnpm build`
- Install command: `pnpm install`
- Node.js: 20.x

Optional environment variables (see `.env.example`):

- `NEXT_PUBLIC_SITE_URL` — Canonical production URL for SEO metadata

## Health check

After deploy, verify: `GET /api/health` → `{ "ok": true, "version": "..." }`

## License

Private project.
