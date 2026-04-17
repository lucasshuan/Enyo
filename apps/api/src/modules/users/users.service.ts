import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { Prisma } from '@ares/db';

@Injectable()
export class UsersService {
  constructor(private databaseProvider: DatabaseProvider) {}

  async findByUsername(username: string) {
    return this.databaseProvider.user.findFirst({
      where: {
        username,
      },
    });
  }

  async search(pagination: PaginationInput, query?: string) {
    const { skip, take } = pagination;

    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
            {
              username: { contains: query, mode: Prisma.QueryMode.insensitive },
            },
          ],
        }
      : undefined;

    const [nodes, totalCount] = await Promise.all([
      this.databaseProvider.user.findMany({
        where,
        skip,
        take,
      }),
      this.databaseProvider.user.count({ where }),
    ]);

    return {
      nodes,
      totalCount,
      hasNextPage: skip + take < totalCount,
    };
  }

  async getPlayersWithRanks(userId: string) {
    const players = await this.databaseProvider.player.findMany({
      where: { userId },
      include: {
        game: true,
        leagueEntries: {
          include: {
            league: {
              include: {
                event: true,
              },
            },
          },
        },
      },
    });

    const playerIds = players.map((p) => p.id);
    if (playerIds.length === 0) return players;

    // Rank calculation logic
    const userRanks = await this.databaseProvider.$queryRaw<
      { player_id: string; event_id: string; position: bigint }[]
    >`
      SELECT player_id, event_id, position FROM (
        SELECT 
          player_id, 
          event_id, 
          RANK() OVER (PARTITION BY event_id ORDER BY current_elo DESC) as position
        FROM league_entries
      ) ranked_entries
      WHERE player_id IN (${playerIds.join(',')})
    `;

    return players.map((player) => {
      const leaguesWithPos = player.leagueEntries.map((entry) => {
        const rankInfo = userRanks.find(
          (r) => r.player_id === player.id && r.event_id === entry.leagueId,
        );
        return {
          ...entry,
          position: rankInfo ? Number(rankInfo.position) : 0,
        };
      });
      return {
        ...player,
        leagueEntries: leaguesWithPos,
      };
    });
  }
}
