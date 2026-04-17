import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import { CreateLeagueInput, UpdateLeagueInput } from './dto/leagues.input';
import { PaginationInput } from '../../common/pagination/pagination.input';

function mapLeagueWithEvent<
  T extends {
    eventId: string;
    event: {
      gameId: string;
      id?: string;
      name: string;
      slug: string;
      description: string | null;
      type: string;
      startDate: Date | null;
      endDate: Date | null;
      approvedAt?: Date | null;
      createdAt: Date;
      updatedAt: Date;
    };
  },
>(league: T) {
  return {
    ...league,
    id: league.event.id ?? league.eventId,
    gameId: league.event.gameId,
    name: league.event.name,
    slug: league.event.slug,
    type: league.event.type,
    description: league.event.description,
    startDate: league.event.startDate,
    endDate: league.event.endDate,
    isApproved: !!league.event.approvedAt,
    createdAt: league.event.createdAt,
    updatedAt: league.event.updatedAt,
  };
}

@Injectable()
export class LeaguesService {
  constructor(private databaseProvider: DatabaseProvider) {}

  async findAll(pagination: PaginationInput) {
    const { skip, take } = pagination;

    const [nodes, totalCount] = await Promise.all([
      this.databaseProvider.league.findMany({
        skip,
        take,
        include: {
          event: {
            include: {
              game: true,
            },
          },
        },
        orderBy: {
          event: {
            createdAt: 'desc',
          },
        },
      }),
      this.databaseProvider.league.count(),
    ]);

    return {
      nodes: nodes.map(mapLeagueWithEvent),
      totalCount,
      hasNextPage: skip + take < totalCount,
    };
  }

  async getGame(gameId: string) {
    return this.databaseProvider.game.findUnique({
      where: { id: gameId },
    });
  }

  async getEntries(leagueId: string) {
    return this.databaseProvider.leagueEntry.findMany({
      where: { leagueId },
      include: {
        player: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        currentElo: 'desc',
      },
    });
  }

  async findByGameAndSlug(gameSlug: string, eventSlug: string) {
    const game = await this.databaseProvider.game.findFirst({
      where: { slug: gameSlug },
    });
    if (!game) return null;

    const league = await this.databaseProvider.league.findFirst({
      where: {
        event: {
          gameId: game.id,
          slug: eventSlug,
        },
      },
      include: {
        event: {
          include: {
            game: true,
          },
        },
      },
    });

    return league ? mapLeagueWithEvent(league) : null;
  }

  async update(id: string, data: UpdateLeagueInput, userId?: string) {
    if (userId) {
      const league = await this.databaseProvider.league.findUnique({
        where: { eventId: id },
        include: { event: { select: { authorId: true } } },
      });
      if (league?.event?.authorId && league.event.authorId !== userId) {
        throw new Error('You do not have permission to edit this league');
      }
    }

    const { name, slug, description, ...leagueData } = data;
    const league = await this.databaseProvider.league.update({
      where: { eventId: id },
      data: {
        event: {
          update: {
            name,
            slug,
            description,
          },
        },
        ...leagueData,
      },
      include: { event: true },
    });

    return mapLeagueWithEvent(league);
  }

  async create(data: CreateLeagueInput) {
    const {
      gameId,
      gameName,
      name,
      slug,
      description,
      startDate,
      endDate,
      authorId,
      ...leagueData
    } = data;

    let finalGameId = gameId;

    if (!finalGameId && gameName) {
      // Create new game
      const gameSlug = gameName
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');

      const game = await this.databaseProvider.game.create({
        data: {
          name: gameName,
          slug: gameSlug,
          authorId,
        },
      });
      finalGameId = game.id;
    }

    if (!finalGameId) {
      throw new Error('Game ID or Game Name is required');
    }

    const league = await this.databaseProvider.league.create({
      data: {
        event: {
          create: {
            gameId: finalGameId,
            type: 'LEAGUE',
            name,
            slug,
            description,
            startDate,
            endDate,
            authorId,
          },
        },
        ...leagueData,
      },
      include: { event: true },
    });

    return mapLeagueWithEvent(league);
  }

  async addPlayer(leagueId: string, playerId: string, initialElo?: number) {
    let elo = initialElo;
    if (elo === undefined) {
      const league = await this.databaseProvider.league.findUnique({
        where: { eventId: leagueId },
      });
      elo = league?.initialElo ?? 1000;
    }

    return this.databaseProvider.leagueEntry.create({
      data: {
        leagueId,
        playerId,
        currentElo: elo,
      },
    });
  }

  async registerSelf(leagueId: string, userId: string) {
    // 1. Find or create player for this game
    const league = await this.databaseProvider.league.findUnique({
      where: { eventId: leagueId },
      include: { event: true },
    });
    if (!league) throw new Error('League not found');

    let player = await this.databaseProvider.player.findUnique({
      where: { gameId_userId: { gameId: league.event.gameId, userId } },
    });

    if (!player) {
      player = await this.databaseProvider.player.create({
        data: {
          gameId: league.event.gameId,
          userId,
        },
      });
    }

    // 2. Add to league entries
    return this.databaseProvider.leagueEntry.create({
      data: {
        leagueId,
        playerId: player.id,
        currentElo: league.initialElo,
      },
    });
  }
}
