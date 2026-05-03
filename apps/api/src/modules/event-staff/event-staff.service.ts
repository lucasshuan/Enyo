import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import {
  EVENT_STAFF_CAPABILITIES,
  type EventStaffCapability,
} from '@bellona/core';

@Injectable()
export class EventStaffService {
  constructor(private db: DatabaseProvider) {}

  async getStaff(eventId: string) {
    return this.db.eventStaff.findMany({
      where: { eventId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Insert or update a staff entry. Capabilities outside the known catalog
   * are silently dropped to keep persisted data consistent.
   */
  async upsertStaff(
    eventId: string,
    userId: string,
    capabilities: string[] = [],
    isFullAccess = false,
  ) {
    const sanitized = this.sanitizeCapabilities(capabilities);
    return this.db.eventStaff.upsert({
      where: { eventId_userId: { eventId, userId } },
      create: {
        eventId,
        userId,
        capabilities: sanitized,
        isFullAccess,
      },
      update: {
        capabilities: sanitized,
        isFullAccess,
      },
      include: { user: true },
    });
  }

  async removeStaff(eventId: string, userId: string) {
    return this.db.eventStaff.delete({
      where: { eventId_userId: { eventId, userId } },
    });
  }

  /**
   * Returns true when the user has the given capability on the event,
   * either by being a full-access member or by having it listed.
   */
  async hasCapability(
    eventId: string,
    userId: string,
    capability: EventStaffCapability,
  ): Promise<boolean> {
    const staff = await this.db.eventStaff.findUnique({
      where: { eventId_userId: { eventId, userId } },
      select: { capabilities: true, isFullAccess: true },
    });
    if (!staff) return false;
    if (staff.isFullAccess) return true;
    return staff.capabilities.includes(capability);
  }

  private sanitizeCapabilities(capabilities: string[]): string[] {
    const known = new Set<string>(EVENT_STAFF_CAPABILITIES);
    return Array.from(new Set(capabilities.filter((c) => known.has(c))));
  }
}
