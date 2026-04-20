import { Injectable } from '@nestjs/common';
import { ParticipationMode } from '@prisma/client';
import { DatabaseProvider } from '../../database/database.provider';
import {
  CreateStandardLeagueInput,
  UpdateStandardLeagueInput,
} from './dto/standard-leagues.input';
import { CreateEventInput, UpdateEventInput } from '../events/dto/event.input';
import { PaginationInput } from '../../common/pagination/pagination.input';

function mapStandardLeagueWithEvent<
  T extends {
    eventId: string;
    event: {
      gameId: string;
      id?: string;
      name: string;
      slug: string;
      type: string;
      participationMode: string;
      description: string | null;
      about: string | null;
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
    event: {
      id: league.event.id ?? league.eventId,
      gameId: league.event.gameId,
      type: league.event.type,
      participationMode: league.event.participationMode,
      name: league.event.name,
      slug: league.event.slug,
      description: league.event.description,
      about: league.event.about,
      isApproved: !!league.event.approvedAt,
      startDate: league.event.startDate,
      endDate: league.event.endDate,
      createdAt: league.event.createdAt,
      updatedAt: league.event.updatedAt,
    },
  };
}

@Injectable()
export class StandardLeaguesService {
  constructor(private databaseProvider: DatabaseProvider) {}

  async findAll(pagination: PaginationInput) {
    const { skip, take } = pagination;

    const [nodes, totalCount] = await Promise.all([
      this.databaseProvider.standardLeague.findMany({
        skip,
        take,
        include: {
          event: {
            include: { game: true },
          },
        },
        orderBy: {
          event: { createdAt: 'desc' },
        },
      }),
      this.databaseProvider.standardLeague.count(),
    ]);

    return {
      nodes: nodes.map(mapStandardLeagueWithEvent),
      totalCount,
      hasNextPage: skip + take < totalCount,
    };
  }

  async findByGameAndSlug(gameSlug: string, eventSlug: string) {
    const game = await this.databaseProvider.game.findFirst({
      where: { slug: gameSlug },
    });
    if (!game) return null;

    const league = await this.databaseProvider.standardLeague.findFirst({
      where: {
        event: {
          gameId: game.id,
          slug: eventSlug,
        },
      },
      include: {
        event: {
          include: { game: true },
        },
      },
    });

    return league ? mapStandardLeagueWithEvent(league) : null;
  }

  async getEntries(leagueId: string) {
    return this.databaseProvider.standardLeagueEntry.findMany({
      where: { leagueId },
      include: {
        player: {
          include: { user: true },
        },
      },
      orderBy: [{ points: 'desc' }, { wins: 'desc' }],
    });
  }

  async update(
    id: string,
    eventData?: UpdateEventInput,
    leagueData?: UpdateStandardLeagueInput,
    userId?: string,
  ) {
    if (userId) {
      const league = await this.databaseProvider.standardLeague.findUnique({
        where: { eventId: id },
        include: { event: { select: { authorId: true } } },
      });

      if (league?.event?.authorId && league.event.authorId !== userId) {
        throw new Error('You do not have permission to edit this league');
      }
    }

    const { allowedFormats, ...restLeagueData } = leagueData ?? {};

    const league = await this.databaseProvider.standardLeague.update({
      where: { eventId: id },
      data: {
        ...(eventData
          ? {
              event: {
                update: {
                  name: eventData.name,
                  slug: eventData.slug,
                  description: eventData.description,
                  about: eventData.about,
                },
              },
            }
          : {}),
        ...(allowedFormats ? { allowedFormats } : {}),
        ...restLeagueData,
      },
      include: { event: true },
    });

    return mapStandardLeagueWithEvent(league);
  }

  async create(
    eventData: CreateEventInput,
    leagueData: CreateStandardLeagueInput,
    authorId: string,
  ) {
    const {
      gameId,
      gameName,
      name,
      slug,
      description,
      about,
      startDate,
      endDate,
      participationMode,
    } = eventData;

    let finalGameId = gameId;

    if (!finalGameId && gameName) {
      const gameSlug = gameName
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');

      const game = await this.databaseProvider.game.create({
        data: { name: gameName, slug: gameSlug, authorId },
      });
      finalGameId = game.id;
    }

    if (!finalGameId) {
      throw new Error('Game ID or Game Name is required');
    }

    const league = await this.databaseProvider.standardLeague.create({
      data: {
        event: {
          create: {
            gameId: finalGameId,
            type: 'STANDARD_LEAGUE',
            participationMode: (participationMode ??
              'SOLO') as ParticipationMode,
            name,
            slug,
            description,
            about,
            startDate,
            endDate,
            authorId,
          },
        },
        ...leagueData,
      },
      include: { event: true },
    });

    return mapStandardLeagueWithEvent(league);
  }

  async addPlayer(leagueId: string, playerId: string) {
    return this.databaseProvider.standardLeagueEntry.create({
      data: { leagueId, playerId },
    });
  }

  async registerSelf(leagueId: string, userId: string) {
    const league = await this.databaseProvider.standardLeague.findUnique({
      where: { eventId: leagueId },
      include: { event: true },
    });
    if (!league) throw new Error('League not found');

    let player = await this.databaseProvider.player.findUnique({
      where: { gameId_userId: { gameId: league.event.gameId, userId } },
    });

    if (!player) {
      player = await this.databaseProvider.player.create({
        data: { gameId: league.event.gameId, userId },
      });
    }

    return this.databaseProvider.standardLeagueEntry.create({
      data: { leagueId, playerId: player.id },
    });
  }
}
