# Himnario Rayos de Esperanza

Digital hymnbook for Iglesia de Dios en México. A Progressive Web App (PWA) to search, read, and save hymns from **Himnario Rayos de Esperanza** on the web or on your phone, with offline support during worship.

A community project to support local churches with a modern tool: fast search, comfortable reading, favorites, and reading preferences stored on the device.

## Features

- **406 hymns** across two collections: Himnos Normales and Himnos Especiales
- **Search** by title, number, or lyrics
- **Favorites** and recent hymns (stored locally)
- **Reader** with text size, alignment, and light/dark theme
- **Installable PWA** on the home screen (iOS and Android)
- **Offline use** after installing and opening the app once while online
- **Settings** at `/configuracion` (reading preferences and install)
- **About** at `/acerca` (mission, version, development)
- **Terms of use** and **privacy policy** at `/terminos` and `/privacidad`

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Jest](https://jestjs.io/) + [Playwright](https://playwright.dev/) for testing

## Prerequisites

- Node.js 22.13+
- [pnpm](https://pnpm.io/) 11+

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Generate hymn JSON and build for production |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript (`tsc --noEmit`) |
| `pnpm test` | Run unit tests (Jest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm generate:hymns` | Regenerate hymn JSON from XML source |

## Hymn content

Hymns are generated from XML files in `docs/himnario/` (local only, not in git). The repository ships with committed JSON for CI and deployment.

To update hymns after editing the XML:

```bash
pnpm generate:hymns
```

This updates `src/lib/hymns/generated-hymns.json` and `public/hymns.json`. Commit both files before deploying.

## PWA and offline use

1. Install the app from **Configuración** or the browser menu.
2. Open the app **once while online** so the service worker can precache hymns and core pages (~431 routes).
3. After that, hymns, search, and catalog pages work offline.

### Cache versioning

The service worker uses a cache name in `public/sw.js` (e.g. `himnario-v5`). **Bump the version** when deploying changes that affect cached assets so returning users receive fresh content.

## Project structure

```
src/
  app/              Routes (library, search, favorites, hymns, settings, about, legal)
  features/         Domain UI (hymnal, about, legal)
  components/       Layout, PWA, navigation
  lib/              Hymns, metadata, app-info
  services/         localStorage preferences
public/
  sw.js             Service worker
  hymns.json        Hymn data for offline precache
scripts/
  generate-hymns.mjs
```

## Quality and CI

Every push or pull request to `main` runs on GitHub Actions:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm test:e2e`
5. `pnpm build`

To run everything locally before pushing:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` trigger CI and automatic deployment.

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Install command | `pnpm install` |
| Node.js | 22.x |

### Environment variables

Optional (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (Open Graph, sitemap). Vercel sets `VERCEL_URL` automatically. |

### Health check

After deploy:

```http
GET /api/health
```

Response: `{ "ok": true, "version": "0.1.0" }`

## Credits

Built by [Daniel Campos (giusniyyel)](https://www.giusniyyel.dev/) for the church community.

Hymn lyrics belong to Himnario Rayos de Esperanza and their respective rights holders. This tool is a digital aid for personal and congregational worship; it is not presented as an official product of Iglesia de Dios en México unless formally endorsed by its leadership.

## License

Private project.
