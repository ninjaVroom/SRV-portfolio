# Samuel Roland Vroom — Portfolio

A portfolio site for **Samuel Roland Vroom** — *"seven crafts, one operator."* The home page is an
editorial **Index** of seven disciplines (Project Management, Web, Mobile, Graphic Design, Video,
Writing, Screenwriting); each links to its own discipline page.

Built from a Claude Design HTML/CSS handoff and re-implemented as a real, content-managed application.

## Stack

| Layer      | Choice                                                            |
| ---------- | ----------------------------------------------------------------- |
| Framework  | [Next.js 15](https://nextjs.org) (App Router, React Server Components) |
| CMS / API  | [Payload CMS 3](https://payloadcms.com) (runs natively inside Next.js) |
| Database   | PostgreSQL 16 via `@payloadcms/db-postgres`                        |
| Media      | Local-disk storage (persisted to a Docker volume)                 |
| Hosting    | Docker self-host (`docker-compose.yml` + multi-stage `Dockerfile`) |

## How content maps to the design

The page **layout and design live in code**; the **section contents are edited in Payload**. Nothing is
a generic page-builder — each page is a fixed, pixel-faithful template whose copy/data comes from typed
fields.

| Payload entity                  | Drives                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| **Disciplines** (collection)    | One document per discipline page: hero, capabilities, selected work, proof banner, tools, footer headline, plus its row on the home Index (number, role, tools, accent, "Primary focus" flag). |
| **Home** (global)               | Masthead eyebrow / name / lede / facts, the Index heading, footer headline, and SEO/OG. |
| **Site Settings** (global)      | Name, availability status, contact (email, phone, location, LinkedIn), domain, copyright, monogram logos, and the résumé PDF. |
| **Media** (collection)          | Uploaded images and the résumé PDF (logo, reversed logo, résumé, optional project shots). |

Several text fields (lede, hero intro, proof description, footer headlines) may contain inline
`<em>…</em>` / `<strong>…</strong>` markers, which the frontend renders safely (no raw-HTML injection).

## Project structure

```
src/
  payload.config.ts            # Payload config: db (postgres), collections, globals
  collections/                 # Disciplines, Media, Users
  globals/                     # HomeContent, SiteSettings
  seed/                        # Idempotent seed: content.json + assets + seed.ts
  app/
    (payload)/                 # Payload admin UI + REST/GraphQL routes (/admin, /api)
    (frontend)/                # Public site: home (/) and /[discipline]
  components/                  # Shared UI (top bar, footer, inline-emphasis renderer, …)
  styles/                      # Design system ported from the handoff (tokens, discipline, home)
```

## Local development

Prerequisites: Node ≥ 20, pnpm, and either Docker (for Postgres) or a local PostgreSQL 16.

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL (Docker self-host model)
docker compose up -d postgres

# 3. Configure env (copy and adjust)
cp .env.example .env

# 4. Run the app (Payload pushes the schema automatically in dev)
pnpm dev

# 5. Seed all real content + media (idempotent — safe to re-run)
pnpm seed
```

- Public site: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin> (first admin is created by the seed; credentials come from
  `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`)

### Useful scripts

| Script                     | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `pnpm dev`                 | Next.js + Payload dev server                        |
| `pnpm build` / `pnpm start`| Production build / start                            |
| `pnpm seed`                | Seed content, media, and the first admin user       |
| `pnpm generate:types`      | Regenerate `src/payload-types.ts` from the config   |
| `pnpm generate:importmap`  | Regenerate the admin import map                     |

## Environment variables

| Variable                 | Description                                                            |
| ------------------------ | --------------------------------------------------------------------- |
| `DATABASE_URI`           | PostgreSQL connection string (`postgres://payload:payload@localhost:5432/srv_portfolio`). |
| `PAYLOAD_SECRET`         | Secret used to sign Payload tokens. **Set a long random value.**       |
| `NEXT_PUBLIC_SERVER_URL` | Public site URL (absolute links / CORS).                              |
| `SEED_ADMIN_EMAIL`       | Email for the admin user created by the seed.                         |
| `SEED_ADMIN_PASSWORD`    | Password for that admin user.                                         |

## Docker self-host

```bash
# Postgres only (run the Next/Payload app on the host)
docker compose up -d postgres

# Full stack: Postgres + the built Next.js/Payload app on :3000
docker compose --profile app up -d --build
```

Uploaded media and the database persist in named Docker volumes (`media`, `pgdata`). In production the
Postgres adapter uses `push: false` — generate and run migrations (`pnpm payload migrate:create`,
`pnpm payload migrate`) when evolving the schema against real data.

## Credits

Design handoff exported from Claude Design; implementation in Next.js + Payload + PostgreSQL.
