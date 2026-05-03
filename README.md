<div align="center">
  <img src="apps/web/public/logo.svg" alt="Bellona" width="80" />
  <h1>Bellona</h1>
</div>

**A 100% free and open-source competition and community platform** focused on games. Communities create games, organize leagues and tournaments in many formats (Elo, round robin, elimination, Swiss, group stage, and more), build teams and clans, and interact through forums and customizable profiles - all with no paywall.

> Public repository that also serves as an architecture reference for a modern monorepo with Next.js + NestJS + GraphQL + Prisma. Open to contributors and sustained by the community.

## What It Is

- Users sign in through Discord OAuth
- Anyone can create a game and organize competitions inside it
- **Leagues** with two modes: **Elo** (dynamic rating with K-factor, score relevance, and inactivity decay) or **Points** (win/draw/loss with configurable scoring)
- **Tournaments** with brackets: single elimination, double elimination, Swiss system, group stage, and custom stage composition
- Matches can be **scheduled** or have **results recorded** with format, score, and optional proof (image, YouTube, Twitch)
- Event creators define **custom per-match data** (kills, assists, damage, and so on) through dynamic forms
- **Teams and Clans**: create multi-player squads and track collective rankings
- **Forums and posts** on user, game, and event pages
- **Highly customizable profiles** - each player's personal "temple", inspired by Discord and Steam
- **Notifications and invites** for events, plus event moderation staff
- **Administrative panel** for admins and moderators
- Real-time ranking with aggressive page caching
- **100% free forever** - open source, sustained by sponsors and donations

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS v4 |
| Backend  | NestJS, code-first GraphQL, Passport-JWT          |
| Database | PostgreSQL + Prisma                               |
| Auth     | Discord OAuth -> JWT                              |
| Monorepo | pnpm workspaces + Turborepo                       |
| i18n     | next-intl (`en` and `pt`)                         |
| Upload   | Presigned URL (S3-compatible)                     |

## Structure

```
apps/
  api/       NestJS + GraphQL - backend
  web/       Next.js - frontend
packages/
  core/      Shared enums, permissions, and types
  db/        Prisma schema, migrations, and singleton client
```

To understand the conventions and architectural decisions, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Running Locally

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (or Neon/Supabase)
- Discord OAuth application

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/db/.env.example packages/db/.env
```

**`apps/api/.env`:**

| Variable                | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string                        |
| `JWT_SECRET`            | Secret used to sign JWT tokens                      |
| `DISCORD_CLIENT_ID`     | Discord OAuth application client ID                 |
| `DISCORD_CLIENT_SECRET` | Discord OAuth application client secret             |
| `CORS_ORIGIN`           | Frontend URL (for example, `http://localhost:3000`) |

**`apps/web/.env`:**

| Variable              | Description                                    |
| --------------------- | ---------------------------------------------- |
| `NEXTAUTH_SECRET`     | NextAuth secret                                |
| `NEXT_PUBLIC_API_URL` | API URL (for example, `http://localhost:4000`) |

```bash
# 3. Run migrations and seed
pnpm db:migrate
pnpm db:seed

# 4. Start development
pnpm dev
```

## Main Scripts

```bash
pnpm dev           # starts API and web in parallel
pnpm dev:api       # only the API (port 4000)
pnpm dev:web       # only the frontend (port 3000)
pnpm lint          # lint all packages
pnpm typecheck     # tsc --noEmit in all packages
pnpm codegen       # regenerate Apollo types (run after changing the GraphQL schema)
pnpm db:migrate    # run Prisma migrations
```

## Contributing

This repository follows the conventions described in [ARCHITECTURE.md](ARCHITECTURE.md). Read it before opening a PR.
