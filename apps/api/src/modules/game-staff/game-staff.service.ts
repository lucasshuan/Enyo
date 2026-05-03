import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import {
  GAME_STAFF_CAPABILITIES,
  type GameStaffCapability,
} from '@bellona/core';

interface MemberInput {
  userId: string;
  capabilities?: string[];
  isFullAccess?: boolean;
}

@Injectable()
export class GameStaffService {
  constructor(private db: DatabaseProvider) {}

  async getStaff(gameId: string) {
    return this.db.gameStaff.findMany({
      where: { gameId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Returns true when the user has the given capability on the game,
   * either by being a full-access member or by having it listed.
   */
  async hasCapability(
    gameId: string,
    userId: string,
    capability: GameStaffCapability,
  ): Promise<boolean> {
    const staff = await this.db.gameStaff.findUnique({
      where: { gameId_userId: { gameId, userId } },
      select: { capabilities: true, isFullAccess: true },
    });
    if (!staff) return false;
    if (staff.isFullAccess) return true;
    return staff.capabilities.includes(capability);
  }

  /**
   * Replace the entire staff list for a game in a single transaction. Members
   * not present in `members` are removed. Members already present are updated;
   * new ones are inserted.
   */
  async setStaff(gameId: string, members: MemberInput[]) {
    const incoming = new Map(members.map((m) => [m.userId, m]));

    return this.db.$transaction(async (tx) => {
      const existing = await tx.gameStaff.findMany({
        where: { gameId },
        select: { userId: true },
      });

      const toRemove = existing
        .filter((e) => !incoming.has(e.userId))
        .map((e) => e.userId);

      if (toRemove.length > 0) {
        await tx.gameStaff.deleteMany({
          where: { gameId, userId: { in: toRemove } },
        });
      }

      for (const member of members) {
        const sanitized = this.sanitizeCapabilities(member.capabilities ?? []);
        await tx.gameStaff.upsert({
          where: { gameId_userId: { gameId, userId: member.userId } },
          create: {
            gameId,
            userId: member.userId,
            capabilities: sanitized,
            isFullAccess: member.isFullAccess ?? false,
          },
          update: {
            capabilities: sanitized,
            isFullAccess: member.isFullAccess ?? false,
          },
        });
      }

      return tx.gameStaff.findMany({
        where: { gameId },
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      });
    });
  }

  private sanitizeCapabilities(capabilities: string[]): string[] {
    const known = new Set<string>(GAME_STAFF_CAPABILITIES);
    return Array.from(new Set(capabilities.filter((c) => known.has(c))));
  }
}
