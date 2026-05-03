import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import { PaginationInput } from '../../common/pagination/pagination.input';
import {
  CreateLeagueEventInput,
  CreateLeagueConfigInput,
  UpdateLeagueEventInput,
  UpdateLeagueConfigInput,
} from './dto/leagues.input';
import { Prisma } from '@bellona/db';

@Injectable()
export class LeaguesService {
  constructor(private db: DatabaseProvider) {}

  private mapLeague(league: {
    eventId: string;
    classificationSystem: string;
    config: Prisma.JsonValue;
    allowDraw: boolean;
    allowedFormats: string[];
    customFieldSchema: Prisma.JsonValue | null;
    event: {
      id: string;
      gameId: string;
      type: string;
      participationMode: string;
      status: string;
      visibility: string;
      name: string;
      slug: string;
      description: string | null;
      about: string | null;
      approvedAt: Date | null;
      startDate: Date | null;
      endDate: Date | null;
      registrationsEnabled: boolean;
      registrationStartDate: Date | null;
      registrationEndDate: Date | null;
      maxParticipants: number | null;
      requiresApproval: boolean;
      waitlistEnabled: boolean;
      officialLinks: Prisma.JsonValue | null;
      authorId: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }) {
    return {
      ...league,
      event: {
        ...league.event,
        isApproved: !!league.event.approvedAt,
      },
    };
  }

  async findByEventId(eventId: string) {
    const league = await this.db.league.findUnique({
      where: { eventId },
      include: { event: true },
    });
    return league ? this.mapLeague(league) : null;
  }

  async checkSlug(
    gameId: string,
    slug: string,
    excludeEventId?: string,
  ): Promise<boolean> {
    const existing = await this.db.event.findFirst({
      where: {
        gameId,
        slug,
        ...(excludeEventId ? { id: { not: excludeEventId } } : {}),
      },
      select: { id: true },
    });
    return !existing;
  }

  async findByEventSlug(gameSlug: string, eventSlug: string) {
    const league = await this.db.league.findFirst({
      where: { event: { slug: eventSlug, game: { slug: gameSlug } } },
      include: { event: true },
    });
    return league ? this.mapLeague(league) : null;
  }

  async findAllByGame(gameId: string, pagination: PaginationInput) {
    const { skip, take } = pagination;

    const [leagues, totalCount] = await Promise.all([
      this.db.league.findMany({
        where: { event: { gameId } },
        include: { event: true },
        orderBy: { event: { createdAt: 'desc' } },
        skip,
        take,
      }),
      this.db.league.count({ where: { event: { gameId } } }),
    ]);

    return {
      nodes: leagues.map((l) => this.mapLeague(l)),
      totalCount,
      hasNextPage: skip + take < totalCount,
    };
  }

  async create(
    eventInput: CreateLeagueEventInput,
    leagueInput: CreateLeagueConfigInput,
    authorId: string,
    initialStaff?: Array<{
      userId: string;
      capabilities?: string[];
      isFullAccess?: boolean;
    }>,
    initialEntries?: Array<{
      displayName: string;
      userId?: string;
      imagePath?: string;
    }>,
  ) {
    const gameId =
      eventInput.gameId ?? (await this.resolveGameId(eventInput.gameName));

    const result = await this.db.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          gameId: gameId!,
          type: 'LEAGUE',
          participationMode: (eventInput.participationMode ?? 'SOLO') as never,
          status: (eventInput.status ?? 'PENDING') as never,
          visibility: (eventInput.visibility ?? 'PUBLIC') as never,
          name: eventInput.name,
          slug: eventInput.slug,
          description: eventInput.description,
          about: eventInput.about,
          startDate: eventInput.startDate,
          endDate: eventInput.endDate,
          registrationsEnabled: eventInput.registrationsEnabled ?? false,
          registrationStartDate: eventInput.registrationStartDate,
          registrationEndDate: eventInput.registrationEndDate,
          maxParticipants: eventInput.maxParticipants ?? null,
          requiresApproval: eventInput.requiresApproval ?? false,
          waitlistEnabled: eventInput.waitlistEnabled ?? false,
          officialLinks:
            (eventInput.officialLinks as Prisma.InputJsonValue) ??
            Prisma.JsonNull,
          authorId,
        },
      });

      const league = await tx.league.create({
        data: {
          eventId: event.id,
          classificationSystem: leagueInput.classificationSystem as never,
          config: leagueInput.config as Prisma.InputJsonValue,
          allowDraw: leagueInput.allowDraw ?? false,
          allowedFormats: (leagueInput.allowedFormats as never[]) ?? [],
          customFieldSchema:
            (leagueInput.customFieldSchema as Prisma.InputJsonValue) ??
            Prisma.JsonNull,
        },
        include: { event: true },
      });

      // Author is automatically created with full access (acts as owner)
      await tx.eventStaff.create({
        data: {
          eventId: event.id,
          userId: authorId,
          isFullAccess: true,
          capabilities: [],
        },
      });

      // Add extra staff members (skip the author, already added with full access)
      if (initialStaff && initialStaff.length > 0) {
        for (const s of initialStaff) {
          if (s.userId !== authorId) {
            await tx.eventStaff.create({
              data: {
                eventId: event.id,
                userId: s.userId,
                capabilities: s.capabilities ?? [],
                isFullAccess: s.isFullAccess ?? false,
              },
            });
          }
        }
      }

      // Create initial event entries
      if (initialEntries && initialEntries.length > 0) {
        const seenUserIds = new Set<string>();
        for (const entry of initialEntries) {
          if (!entry.displayName.trim()) continue;
          const userId =
            entry.userId && !seenUserIds.has(entry.userId)
              ? entry.userId
              : undefined;
          if (userId) seenUserIds.add(userId);
          await tx.eventEntry.create({
            data: {
              eventId: event.id,
              displayName: entry.displayName.trim(),
              imagePath: entry.imagePath ?? null,
              userId: userId ?? null,
            },
          });
        }
      }

      return league;
    });

    return this.mapLeague(result);
  }

  async update(
    eventId: string,
    eventInput?: UpdateLeagueEventInput,
    leagueInput?: UpdateLeagueConfigInput,
  ) {
    const [league] = await this.db.$transaction(async (tx) => {
      if (eventInput && Object.keys(eventInput).length > 0) {
        const { officialLinks, status, visibility, ...rest } = eventInput;
        const eventData: Prisma.EventUpdateInput = {
          ...rest,
          ...(status !== undefined && { status: status as never }),
          ...(visibility !== undefined && { visibility: visibility as never }),
          ...(officialLinks !== undefined && {
            officialLinks:
              (officialLinks as Prisma.InputJsonValue | null) ??
              Prisma.JsonNull,
          }),
        };

        await tx.event.update({
          where: { id: eventId },
          data: eventData,
        });
      }

      if (leagueInput && Object.keys(leagueInput).length > 0) {
        const {
          config,
          customFieldSchema,
          allowedFormats,
          classificationSystem,
          ...rest
        } = leagueInput;
        await tx.league.update({
          where: { eventId },
          data: {
            ...rest,
            ...(classificationSystem !== undefined && {
              classificationSystem: classificationSystem as never,
            }),
            ...(config !== undefined && {
              config: config as Prisma.InputJsonValue,
            }),
            ...(customFieldSchema !== undefined && {
              customFieldSchema: customFieldSchema as Prisma.InputJsonValue,
            }),
            ...(allowedFormats !== undefined && {
              allowedFormats: allowedFormats as never[],
            }),
          },
        });
      }

      return tx.league.findMany({
        where: { eventId },
        include: { event: true },
      });
    });

    return this.mapLeague(league);
  }

  private async resolveGameId(gameName?: string): Promise<string | undefined> {
    if (!gameName) return undefined;
    const game = await this.db.game.findFirst({ where: { name: gameName } });
    return game?.id;
  }
}
