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
import { StorageService } from '../storage/storage.service';

@Injectable()
export class LeaguesService {
  constructor(
    private db: DatabaseProvider,
    private storageService: StorageService,
  ) {}

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
      _count?: { entries: number };
      entries?: Array<{
        id: string;
        displayName: string;
        imagePath: string | null;
        userId: string | null;
        entryStatus: string;
        stats: Prisma.JsonValue;
        createdAt: Date;
        user?: { imagePath: string | null; country: string | null } | null;
      }>;
    };
  }) {
    const { entries, ...restEvent } = league.event;
    return {
      ...league,
      event: {
        ...restEvent,
        isApproved: !!league.event.approvedAt,
        entriesCount: league.event._count?.entries ?? 0,
        topEntries: (entries ?? [])
          .slice()
          .sort((a, b) => {
            const getScore = (s: Prisma.JsonValue) => {
              if (!s || typeof s !== 'object' || Array.isArray(s)) return 0;
              const r = s as Record<string, unknown>;
              return Number(r.elo ?? r.currentElo ?? r.points ?? 0);
            };
            return getScore(b.stats) - getScore(a.stats);
          })
          .slice(0, 5)
          .map((e) => ({
            ...e,
            eventId: league.eventId,
            stats: e.stats ?? {},
          })),
      },
    };
  }

  async findByEventId(eventId: string) {
    const league = await this.db.league.findFirst({
      where: { eventId, event: { deletedAt: null } },
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
        deletedAt: null,
        ...(excludeEventId ? { id: { not: excludeEventId } } : {}),
      },
      select: { id: true },
    });
    return !existing;
  }

  async findByEventSlug(gameSlug: string, eventSlug: string) {
    const league = await this.db.league.findFirst({
      where: {
        event: { slug: eventSlug, deletedAt: null, game: { slug: gameSlug } },
      },
      include: { event: true },
    });
    return league ? this.mapLeague(league) : null;
  }

  async findAllByGame(gameId: string | undefined, pagination: PaginationInput) {
    const { skip, take } = pagination;
    const where = gameId
      ? { event: { gameId, deletedAt: null } }
      : { event: { deletedAt: null } };

    const [leagues, totalCount] = await Promise.all([
      this.db.league.findMany({
        where,
        include: {
          event: {
            include: {
              _count: { select: { entries: true } },
              entries: {
                where: { entryStatus: 'CONFIRMED' },
                take: 50,
                include: {
                  user: { select: { imagePath: true, country: true } },
                },
              },
            },
          },
        },
        orderBy: { event: { createdAt: 'desc' } },
        skip,
        take,
      }),
      this.db.league.count({ where }),
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

    // Move thumbnail from tmp to permanent location before creating the event
    let thumbnailImagePath: string | undefined;
    if (
      eventInput.thumbnailImagePath &&
      this.storageService.isTmpPath(eventInput.thumbnailImagePath)
    ) {
      const filename = eventInput.thumbnailImagePath.split('/').pop()!;
      thumbnailImagePath = await this.storageService.moveFile(
        eventInput.thumbnailImagePath,
        `events/tmp-placeholder/thumbnail-${filename}`,
      );
    } else {
      thumbnailImagePath = eventInput.thumbnailImagePath;
    }

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
          thumbnailImagePath: thumbnailImagePath ?? null,
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

      // Rename to permanent location using the real event id
      if (
        thumbnailImagePath &&
        thumbnailImagePath.includes('tmp-placeholder')
      ) {
        const filename = thumbnailImagePath.split('/').pop()!;
        const permanentPath = await this.storageService.moveFile(
          thumbnailImagePath,
          `events/${event.id}/thumbnail-${filename}`,
        );
        await tx.event.update({
          where: { id: event.id },
          data: { thumbnailImagePath: permanentPath },
        });
      }

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
    let mutableEventInput = eventInput ? { ...eventInput } : undefined;

    // Move thumbnail from tmp to permanent location
    if (
      mutableEventInput?.thumbnailImagePath &&
      this.storageService.isTmpPath(mutableEventInput.thumbnailImagePath)
    ) {
      const current = await this.db.event.findUnique({
        where: { id: eventId },
        select: { thumbnailImagePath: true },
      });
      const filename = mutableEventInput.thumbnailImagePath.split('/').pop()!;
      const permanentPath = await this.storageService.moveFile(
        mutableEventInput.thumbnailImagePath,
        `events/${eventId}/thumbnail-${filename}`,
      );
      mutableEventInput = {
        ...mutableEventInput,
        thumbnailImagePath: permanentPath,
      };
      if (current?.thumbnailImagePath) {
        await this.storageService.deleteFile(current.thumbnailImagePath);
      }
    }

    const [league] = await this.db.$transaction(async (tx) => {
      if (mutableEventInput && Object.keys(mutableEventInput).length > 0) {
        const { officialLinks, status, visibility, ...rest } =
          mutableEventInput;
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

  async deleteEvent(eventId: string, userId: string, isAdmin: boolean) {
    const event = await this.db.event.findUnique({
      where: { id: eventId },
      select: { authorId: true, deletedAt: true },
    });

    if (!event) throw new Error('Event not found');
    if (event.deletedAt) throw new Error('Event is already deleted');

    if (!isAdmin && event.authorId && event.authorId !== userId) {
      // Allow full-access staff to also delete
      const staffRecord = await this.db.eventStaff.findFirst({
        where: { eventId, userId, isFullAccess: true },
      });
      if (!staffRecord) {
        throw new Error('You do not have permission to delete this event');
      }
    }

    return this.db.event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    });
  }

  private async resolveGameId(gameName?: string): Promise<string | undefined> {
    if (!gameName) return undefined;
    const game = await this.db.game.findFirst({ where: { name: gameName } });
    return game?.id;
  }
}
