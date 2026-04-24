# Bellona - General Project Context

> Last updated: April 24, 2026  
> Quick reference for AI and development memory

---

## What Ares Is

A **100% free and open-source** competition and community platform for digital and physical games. Users create games, organize leagues and tournaments in many formats (round robin, Elo rating, single and double elimination, Swiss system, group stage, and more), schedule and record matches, build teams and clans, and interact through forums and highly customizable profiles.

The product is built for **communities** - it is not an official publisher platform. No feature will ever be placed behind a paywall; the project is open source, open to contributors, and intends to sustain itself through sponsors and donations.

---

## Stack

| Layer      | Tech                                                 |
| ---------- | ---------------------------------------------------- |
| Frontend   | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| Backend    | NestJS, GraphQL (code-first), Passport-JWT           |
| Database   | PostgreSQL + Prisma                                  |
| Auth (web) | NextAuth.js (CredentialsProvider -> Discord via API) |
| Auth (api) | Discord OAuth + JWT (7d expiry)                      |
| Monorepo   | pnpm workspaces + Turborepo                          |
| i18n       | next-intl, locales: `en` and `pt`                    |
| Upload     | Presigned URL (S3-compatible)                        |
| Logger     | pino (API) + custom logger (web)                     |

---

## Monorepo Structure

```
apps/api        -> NestJS + GraphQL
apps/web        -> Next.js
packages/db     -> Prisma schema, migrations, seed
packages/core   -> Shared enums, permissions, and types
```

---

## Domain: Core Entities

### User

- Authenticated through Discord (OAuth in the API, then JWT for the web app)
- Fields: `name`, `username`, `email`, `imageUrl`, `bio`, `profileColor`, `country`, `isAdmin`, `onboardingCompleted`
- Can have granular permissions in addition to `isAdmin`

### Game

- Created by users (or by an admin)
- Status: `PENDING` | `APPROVED`
- Has a unique `slug`, thumbnail image (460x215), and background
- Optional Steam link (`steamUrl`)

### Event

- Generic container for competitions inside a `Game`
- Types: `LEAGUE` | `TOURNAMENT`
- Status: `PENDING` | `ACTIVE` | `FINISHED` | `CANCELLED`
- Each `Event` can have a specific extension (for example, `League`)

### League _(Event extension)_

- Rating system: `elo` or `points`
- `config: Json` — classification settings stored as JSON:
  - **ELO shape:** `{ initialElo, kFactor, scoreRelevance, inactivityDecay, inactivityThresholdHours, inactivityDecayFloor }`
  - **POINTS shape:** `{ pointsPerWin, pointsPerDraw, pointsPerLoss }`
- `allowDraw` - whether draws are possible
- `allowedFormats` - accepted match formats (for example, `ONE_V_ONE`, `FREE_FOR_ALL`)
- `customFieldSchema: Json?` — organizer-defined dynamic stat fields per match (for example, kills, assists)

### EventEntry

- Generic participant slot in an `Event` — works for solo or team participation
- Links to a `User` (`userId`, nullable — can be an unnamed slot created by staff)
- `stats: Json` stores computed standings: `{ currentElo }` for ELO leagues, `{ points, wins, draws, losses }` for POINTS leagues
- Supports **claims**: a user can request to be linked to a slot (`USER`-initiated) or staff can invite a user to a slot (`STAFF`-initiated)
- `EntrySnapshot` records a nightly snapshot of each entry's position and stats for historical charts

### TeamMember

- Individual user slot inside a team `EventEntry`
- Same bidirectional claim system as `EventEntry` (via `TeamMemberClaim`)

### EventStaff

- Links a `User` to an `Event` with a role: `ORGANIZER`, `MODERATOR`, or `SCOREKEEPER`
- The event author is automatically inserted as `ORGANIZER` on creation
- Only an `ORGANIZER` can manage (add/remove) staff

### Match

- Can be **scheduled** (`scheduledAt` set, `playedAt` null) or **recorded** (`playedAt` set)
- Belongs to an `Event`; optionally belongs to a `TournamentPhase`
- Each participant is a `MatchParticipant` (`outcome`, `score`, `ratingChange`, `customStats`)
- Supports `MatchAttachment` (image or video: YouTube, Twitch, and so on)
- **Elo/points recalculation after recording** is the next major backend task — not implemented yet

### Tournament _(Event extension)_

- 1:1 extension of `Event` when `type = TOURNAMENT`
- Contains ordered `TournamentPhase[]`, each with its own `PhaseType` (`ROUND_ROBIN`, `ELO_RATING`, `SWISS`, `SINGLE_ELIMINATION`, `DOUBLE_ELIMINATION`, `GROUP_STAGE`)
- Each phase has its own `config: Json`, `allowDraw`, `allowedFormats`, and `customFieldSchema`
- Phase standings tracked in `PhaseEntry` (per-entry stats and seed within a phase)

---

> Planned features and the product vision are in [ROADMAP.md](ROADMAP.md).

---

## Important Business Rules

### Elo and `scoreRelevance`

The standard Elo formula is `ΔElo = K × (S - E)`, where:

- `S` = Score: **1.0** (win), **0.5** (draw), **0.0** (loss)
- `E` = expected win probability based on the Elo difference

`scoreRelevance` does **not multiply** the Elo gained. It **changes the value of `S`** based on the score margin:

- `scoreRelevance = 0` -> `S` is always binary (1/0.5/0); score margin is ignored
- `scoreRelevance > 0` -> close wins push `S` closer to 0.5 (almost a draw for Elo)
- `scoreRelevance = 1` -> a 15x14 win can generate almost the same Elo as a draw

#### Margin-to-`S` Mapping Formula

```
S = 1 - scoreRelevance × (loserScore / winnerScore) × 0.5
```

**Properties:**

- `loserScore = 0` (complete win) -> `S = 1.0` always, regardless of `scoreRelevance`
- `loserScore -> winnerScore` (minimum win) -> `S -> 1 - scoreRelevance × 0.5` (minimum of `0.5` when `scoreRelevance = 1`)
- `scoreRelevance = 0` -> `S = 1.0` always (explicit bypass; margin ignored)
- `scoreRelevance = 1` and score `10x9` -> `S = 1 - 1 × (9/10) × 0.5 = 0.55`
- `scoreRelevance = 1` and score `10x2` -> `S = 1 - 1 × (2/10) × 0.5 = 0.90`

Expected probability `E` uses the standard 400-point scale:

```
E = 1 / (1 + 10^((eloB - eloA) / 400))
```

> **Status**: the formula is defined and implemented in the frontend simulator (Format Logic).  
> The real per-match Elo calculation in the backend (`Result` mutations) has not been built yet.

### Permissions (RBAC)

Defined in `packages/core`:

- `manage_games` - create/edit/approve games
- `manage_users` - manage users
- `manage_events` - manage leagues/events

`isAdmin = true` bypasses all permission checks. Granular permissions exist for moderators and organizers.

### League Creation with a New Game

When creating a league, the user can provide `gameName` instead of `gameId`. If the game does not exist, it is created automatically with status `APPROVED` and an auto-generated slug.

### Event Registration

- Staff with `ORGANIZER` or `SCOREKEEPER` role: can add entries via `addEventEntry`
- Regular users: self-register (creates an `EventEntry` and optionally claims a slot via `claimEventEntry`)
- Bidirectional claim flow: `STAFF`-initiated invite (user must accept) or `USER`-initiated request (staff must approve)

### Ownership

- The event creator is automatically added as `ORGANIZER` staff
- Admins (`isAdmin = true`) bypass all permission checks
- `manage_events` permission grants global event editing access
- The game creator can edit their own game
- `manage_games` bypasses game ownership

---

## Auth Flow

```
Discord OAuth (API)
    ↓
Nest generates a JWT (7 days) with: sub, username, imageUrl, isAdmin, permissions
    ↓
Single-use AuthCode stored in the database
    ↓
Web exchanges the code for the token through /auth/callback
    ↓
NextAuth persists the session with the JWT
    ↓
Apollo Client injects Authorization: Bearer <token> into all queries
    ↓
API validates through JwtStrategy -> GqlAuthGuard
```

The web session is revalidated every **5 minutes** through `/auth/me`.

---

## Frontend Routes (App Router)

| Route                                  | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| `/`                                    | Home with the game list                                      |
| `/games`                               | All games                                                    |
| `/games/[gameSlug]`                    | Game page + its events                                       |
| `/games/[gameSlug]/events/[eventSlug]` | Event page (`EloLeagueTemplate` or `StandardLeagueTemplate`) |
| `/events`                              | Global event listing                                         |
| `/profile/[username]`                  | User profile                                                 |
| `/auth/signin`                         | Login (Discord)                                              |

---

## API Modules

| Module          | Responsibility                                                    |
| --------------- | ----------------------------------------------------------------- |
| `auth`          | Discord OAuth, JWT, AuthCode, guards, decorators, /auth/me        |
| `games`         | Game CRUD, approval, search                                       |
| `events`        | Event field resolver (resolves `game` via DataLoader)             |
| `leagues`       | League CRUD, config management                                    |
| `event-entries` | Entry CRUD, claim flow (invite/request/review), paginated listing |
| `event-staff`   | Staff CRUD, role checks (`ORGANIZER`, `MODERATOR`, `SCOREKEEPER`) |
| `matches`       | Match scheduling, outcome recording, attachment management        |
| `users`         | User lookup, profile, search                                      |
| `storage`       | Presigned URL generation for image uploads                        |
| `audit`         | Administrative action log                                         |

---

## Current Implementation Status

### Completed

- End-to-end authentication (Discord OAuth → JWT → NextAuth → Apollo)
- RBAC with backend guards (`GqlAuthGuard`, `PermissionsGuard`)
- Frontend GraphQL codegen (types generated automatically)
- Enums and permissions centralized in `@bellona/core`
- Versioned Prisma migrations (full domain schema in place)
- Structured logging (pino in the API, custom logger in the web app)
- Hardened bootstrap (`ValidationPipe`, strict CORS, introspection/playground only in dev)
- Uploads through presigned URLs
- Game listing, creation, and editing (with approval flow)
- League listing, creation, and editing (ELO and POINTS)
- Event registration via `EventEntry` + bidirectional claim flow
- Event staff management (`ORGANIZER`, `MODERATOR`, `SCOREKEEPER`)
- Match scheduling and outcome recording (without Elo recalculation)
- i18n with next-intl (`en` + `pt`)
- Onboarding wizard for new users (multi-step: identity, country, game interests)
- Full visual design system: Tailwind v4 tokens, component library (`Modal`, `DataTable`, `ManageButton`, `Tabs`, `Slider`, `TiptapEditor`, `UserChip`, `GlowBorder`, and more)
- Event page templates: `EloLeagueTemplate` and `StandardLeagueTemplate` (scaffolded — UI shell in place, feature content not yet built)

### Next (starting now)

- **Match recording flow** (frontend): submit match outcome form, attach evidence, update entry standings
- **Elo / points recalculation** (backend): after a match is recorded, recompute `EventEntry.stats` and persist `EntrySnapshot`
- **League standings view**: render ranked table with stats from `EventEntry.stats`

---

> Planned features and the product vision are in [ROADMAP.md](ROADMAP.md).
