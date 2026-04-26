# Bellona - Product Roadmap

> Last updated: April 25, 2026  
> Planned feature vision. For the current technical state, see `CONTEXT.md`.

---

## Competition Formats

- **Leagues**: round robin, Elo rating (already partially implemented)
- **Bracket tournaments**: single elimination, double elimination (losers bracket), Swiss system, group stage, and custom stage composition
- Each event can combine formats (for example, group stage -> elimination bracket)

---

## Community and Social

- **Follow players + activity feed**: users follow other players and get a personalized feed with results, ranking changes, newly joined events, and more. A must-have for a real community
- **Forums and posts**: create topics and publications on pages such as the user page (Steam-like), community page (game), and event page
- **Customizable profiles**: highly customizable user pages inspired by Discord and Steam - each player's personal "temple"
- **Notification and invite system**: invite users to events, notify them about matches, ranking updates, posts, and more
- **Event moderation staff**: organizers can define moderators with specific permissions
- **Player career timeline**: a profile timeline showing participated events, relevant results (1st place, longest win streak), and Elo changes over time
- **Cross-event leaderboard per game**: global meta-ranking per game calculated from performance across all active leagues and tournaments. To stay fair, it should require a minimum number of matches or participated events as an eligibility rule. In the future it may expand to cross-game ranking (influential players across multiple games), but that requires very careful criteria
- **Vouching / community reputation**: after matches, participants evaluate each other in categories such as fair play, punctuality, and communication. This produces a visible reputation score on the profile. It does not affect ranking and exists for community trust. Secondary priority for now
- **Rivalries and H2H history**: auto-generated player cards for frequent matchups, showing historical win/loss and Elo differences over time. This is a "living world" feature for the site, with low systemic priority and reserved for the distant future

---

## Matches and Matchmaking

- **Availability and challenges inside leagues**: players in leagues, especially Elo leagues, can declare availability and nearby-Elo players can issue challenges. Accepted matches enter the league automatically. On the profile, users can configure recurring availability (for example, "afternoons", "weekends and Wednesday"), applicable in any context
- **Casual matches and pickup queue**: outside formal events, players declare availability for a game/format; the system matches them by Elo and creates a casual match recorded in history. This acts as continuous warm-up between events

---

## Teams, Captaincy, and Clans

- **Teams with a captain**: teams are created by the players themselves, with one member as captain. The captain manages the roster (add/remove members, submit results for the team). The event organizer only approves or rejects registered teams, without micromanaging the roster
- **Clans**: groups of users with their own ranking based on the members' collective performance. High complexity - requires careful modeling of links among users, teams, clans, and results

---

## Seasons

- **Manual season system**: when creating a new event, the organizer can specify a source event (a "parent event"). The new event inherits the previous event's settings and is treated as a new season. On the frontend, the event page shows integrated season navigation (select, tabs, or similar). No automation - season creation is always an intentional organizer action

---

## Dynamic Event Data

- Event creators can define **custom result fields** (dynamic forms)
- They can represent general event data or per-player data (for example, kills, assists, healing done, damage dealt, match rating)
- This lets each community adapt statistics to its own game

---

## Integrations

- **"Live" page**: a per-game section showing ongoing matches, with stream links (YouTube, Twitch) whenever provided on the match or event. Critical for making the platform feel alive and encouraging participants to stream
- **Discord webhook**: event organizers connect a Discord channel webhook and Ares automatically posts match results, top 3 ranking changes, and tournament phase starts. No bot, just webhook. It can evolve into a bot with interactive commands later
- **Steam API**: fetch and suggest new games if they do not already exist in the project, with caching to avoid excessive use of the free API

---

## Administration and Moderation

- **Administrative panel**: for users with `isAdmin` or granular permissions
- **Ban/block system**: ban users from events, games, or the platform

---

## Performance and Caching

- Aggressive page and ranking caching in Next.js (ISR/revalidation) to reduce API load
- An essential strategy for maintaining performance with lean infrastructure

---

## AI-Assisted Features

These are not planned as core features, but as natural augmentations once the underlying domain data is rich enough to make them useful. Each one is opt-in and non-intrusive.

- **Automatic result extraction from screenshots**: when a participant uploads a match screenshot as evidence, a vision model analyzes the image and pre-fills the score and `customStats` fields based on the event's `customFieldSchema`. The scorekeeper confirms or corrects — no manual data entry. Requires the match recording flow to be complete first.

- **Elo anomaly detection**: after each Elo recalculation, a background job checks for suspicious patterns — sandbagging (intentional losing before bracket play), unusual win/loss streaks between the same two players, or statistically implausible Elo trajectories. Flags entries for human review by event `MODERATOR` staff. Never auto-bans.

- **Natural language queries over custom stats**: organizers and players can ask questions in plain text — _"Who had the best K/D ratio in the last round among players above 1500 Elo?"_ — and an LLM translates the query into a safe, validated Prisma query constrained to the event's `customFieldSchema`. Transforms the dynamic stats system from a storage feature into a real analytics tool.

- **Event setup assistant**: a guided flow during league/tournament creation that accepts plain-language answers and translates them into technical configuration parameters. Lowers the barrier for new organizers who are unfamiliar with Elo concepts like `kFactor`, `scoreRelevance`, and `inactivityDecay`.

- **Semantic game suggestions via Steam API**: beyond basic search, use embedding-based similarity to suggest existing games in Ares to new users based on what they already play and who they follow — without relying on raw popularity. Complements the planned Steam API integration.

- **Elo trajectory projection**: on a player's profile, after a minimum number of matches in a season, display a projected Elo range for the end of the season with a confidence interval, based on the player's recent trajectory and variance. Purely informational — visible on the profile chart.

- **Automatic season recap**: when an event transitions to `FINISHED`, generate a structured narrative post for the event page and Discord webhook: top performers, biggest Elo swings, closest match, milestone streaks, and title defense or change. Requires the Discord webhook integration and rich match history to be in place first.

- **AI-generated challenges** _(gated on automated result ingestion)_: the platform monitors game activity and generates time-limited challenges with objective, verifiable win conditions — clearly badged as AI-created, with no human organizer. The core blocker is result arbitration: without a direct game API that pushes match data into Ares automatically, there is no way to verify challenge completion without a human moderator, which reintroduces the ownership problem. This becomes viable only once automated result ingestion from game APIs is available.

---

## Business Model

- **100% free, forever** - no feature behind a paywall
- Open source and open to contributors
- Sustainability through sponsors and donations

---

## Long-Term Vision

Ares is evolving from a league tool into a **complete competitive community platform**:

1. Anyone can register a game and organize competitions in multiple formats (league, bracket tournament, Swiss, groups, and so on)
2. Matches can be **scheduled** or have **results recorded** with evidence (screenshot/video) and custom data
3. Rankings update automatically - Elo sensitive to score margin, points, or format-specific metrics
4. Players form **teams** and **clans** with collective rankings
5. Every page (user, game, event) has its own **forums**, and profiles are highly customizable
6. **Notifications, invites, and moderation** create a complete social ecosystem
7. Everything is 100% free, open source, and community-sustained

---

## Identity Expansions (Outside-the-Box Ideas)

Beyond the classic "tournaments and leagues" shape, Ares has natural room for adjacent concepts that enrich the ecosystem and attract new kinds of audiences:

### Confirmed

- **Faction Metagame (Territory Control)**: players choose a faction (global houses/guilds). Wins in casual matches or tournaments generate "influence points" for the faction. The site itself gains a metagame where factions dominate the ranking month by month, giving purpose to players who would never win an individual tournament
- **Bounty Hunters Hub (Bounties & Challenges)**: asynchronous competition system. A contract board with objectives such as "First to kill Boss X without taking damage" or "Speedrun under 2 minutes". Players claim them and submit video proof. Focused on speedrunners and engaged creators, not traditional esports
- **Mentorship Economy (Ares Academy)**: high-Elo players create "Bootcamps". Experienced players get a separate _Teaching Elo_ based exclusively on the improvement rate of their students. Encourages cooperation instead of toxicity
- **Advanced LFG Ecosystem (The "Corner Club")**: matchmaking based on behavior and vibe, not ranking. Weekend social events focused on bringing together similar profiles (`[Mic ON]`, `[Zero Tryhard]`, `[Drinking While Playing]`). This addresses the chronic problem of not having people to play with in low-stress environments
- **Oracle (Prediction Market)**: players make virtual bets, with no real money, on matches and tournaments before they happen - who will win, by how much, who drops in groups. Correct predictions accumulate a separate _Prediction Elo_. This creates a parallel esport for spectators and analysts who never compete but still earn prestige by predicting well
- **Regional Pride / Geographic Identity**: players represent their city, state, or country. Real regional rankings with aggregated contribution. Events like "regional derby" or "city vs city" emerge naturally from the data. This gives local identity to a culture that is otherwise purely online and anonymous
- **Chronicles (Automatic Narrator)**: the site observes patterns in the data and generates sports-journalism-style headlines automatically - _"Player X is on a 6-match unbeaten streak, the longest of the season"_, _"These two have never faced each other and may be the finalists"_. Turns cold data into emergent storytelling without human moderation. High impact, low technical cost
- **Format Lab**: users invent their own competition formats, test them in a sandbox with simulated matches, publish them, and let other organizers adopt them. Formats become entities ranked by popularity. This democratizes competition design and creates a community around structural creativity

### Possibilities

- **Hall of Legendary Matches**: matches can be "immortalized" through community voting via Discord-style emoji reactions. Admission to the Hall is based on accumulated engagement. YouTube and Twitch integration would let videos be embedded directly on the site with timestamp linking, so users can comment on and react to specific moments, and those links would work in posts and forums
- **Game Wiki**: each game in Ares could have its own wiki, working as an integrated Fandom/Wikia with collaborative editing and moderation controls. This complements forums with evergreen content such as guides, lore, character maps, and meta information. The organizer or game community manages edit access

---

## Implementation Backlog

Planned or in-progress items, with no defined date:

- **Game selection in onboarding**: UI implemented with mock data; backend persistence (`UserGameInterest`) still missing
- **Backend Elo calculation**: formula is defined, but the `Result` mutation with automatic calculation is not implemented yet
- **Match/Result refactor**: separate match scheduling from result registration
- **Player refactor**: rethink the `User <-> Game` link; username logic needs a new approach
- **Tournament formats**: model brackets (elimination, Swiss, groups, stages) - only leagues exist today
- **Teams and Clans**: full modeling of teams, links, and collective ranking
- **Dynamic event data**: customizable forms for match statistics
- **Forums and posts**: topic and publication system by context (user, game, event)
- **Customizable profiles**: rich profile page customization
- **Notifications and invites**: system for inviting players and notifying about events
- **Administrative panel**: dedicated UI for admins and moderators
- **Ban/block system**: user moderation system
- **Steam API integration**: game lookup with caching
- **Page and ranking caching**: ISR and revalidation strategies in Next.js
- **N+1 / DataLoaders**: they exist, but coverage is still limited
- **Tests**: almost zero coverage, only boilerplate
- **i18n standardization**: multiple `useTranslations` per file; JSON structure can be reorganized
- **Ranking position**: `position` logic is not consolidated
- **Validation CI**: no automated pipeline before deploy
- **Game tags**: games can have tags (for example, "FPS", "MOBA") to improve search
