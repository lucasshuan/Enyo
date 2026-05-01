import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import { CreateGameInput, UpdateGameInput } from './dto/games.input';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { Prisma } from '@bellona/db';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class GamesService {
  constructor(
    private databaseProvider: DatabaseProvider,
    private storageService: StorageService,
  ) {}

  async findAll(pagination: PaginationInput, search?: string) {
    const { skip, take } = pagination;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { slug: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined;

    const [nodes, totalCount] = await Promise.all([
      this.databaseProvider.game.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.databaseProvider.game.count({ where }),
    ]);

    return {
      nodes,
      totalCount,
      hasNextPage: skip + take < totalCount,
    };
  }

  async findBySlug(slug: string) {
    return this.databaseProvider.game.findFirst({
      where: {
        slug: slug,
      },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });
  }

  async getAuthor(authorId: string) {
    return this.databaseProvider.user.findUnique({
      where: { id: authorId },
    });
  }

  async findEventMeta(gameSlug: string, eventSlug: string) {
    const game = await this.databaseProvider.game.findFirst({
      where: { slug: gameSlug },
    });
    if (!game) return null;

    const event = await this.databaseProvider.event.findFirst({
      where: { gameId: game.id, slug: eventSlug },
      select: { id: true, type: true },
    });

    return event ?? null;
  }

  async create(data: CreateGameInput, authorId?: string) {
    return this.databaseProvider.game.create({
      data: {
        ...data,
        authorId,
      },
    });
  }

  async update(id: string, data: UpdateGameInput, userId?: string) {
    const current = await this.databaseProvider.game.findUnique({
      where: { id },
      select: {
        authorId: true,
        backgroundImageUrl: true,
        thumbnailImageUrl: true,
      },
    });

    if (userId) {
      // Apenas o autor ou admin pode editar.
      if (current && current.authorId && current.authorId !== userId) {
        throw new Error('You do not have permission to edit this game');
      }
    }

    // Delete old CDN images when they are replaced
    const deletions: Promise<void>[] = [];
    if (
      data.backgroundImageUrl !== undefined &&
      current?.backgroundImageUrl &&
      current.backgroundImageUrl !== data.backgroundImageUrl
    ) {
      deletions.push(
        this.storageService.deleteFile(current.backgroundImageUrl),
      );
    }
    if (
      data.thumbnailImageUrl !== undefined &&
      current?.thumbnailImageUrl &&
      current.thumbnailImageUrl !== data.thumbnailImageUrl
    ) {
      deletions.push(this.storageService.deleteFile(current.thumbnailImageUrl));
    }
    if (deletions.length > 0) {
      await Promise.all(deletions);
    }

    return this.databaseProvider.game.update({
      where: { id },
      data,
    });
  }

  async checkSlug(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.databaseProvider.game.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !existing;
  }

  async approve(id: string) {
    return this.databaseProvider.game.update({
      where: { id },
      data: {
        status: 'APPROVED',
      },
    });
  }

  async delete(id: string, userId?: string) {
    const game = await this.databaseProvider.game.findUnique({
      where: { id },
      select: {
        authorId: true,
        backgroundImageUrl: true,
        thumbnailImageUrl: true,
        _count: { select: { events: true } },
      },
    });

    if (!game) throw new Error('Game not found');

    if (userId && game.authorId && game.authorId !== userId) {
      throw new Error('You do not have permission to delete this game');
    }

    if (game._count.events > 0) {
      throw new Error(
        'Cannot delete a game that has events. Remove all events first.',
      );
    }

    const deletions: Promise<void>[] = [];
    if (game.backgroundImageUrl) {
      deletions.push(this.storageService.deleteFile(game.backgroundImageUrl));
    }
    if (game.thumbnailImageUrl) {
      deletions.push(this.storageService.deleteFile(game.thumbnailImageUrl));
    }
    if (deletions.length > 0) await Promise.all(deletions);

    return this.databaseProvider.game.delete({ where: { id } });
  }
}
