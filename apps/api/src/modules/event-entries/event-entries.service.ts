import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../database/database.provider';
import { PaginationInput } from '../../common/pagination/pagination.input';
import {
  CreateEventEntryInput,
  UpdateEventEntryInput,
  ClaimEntryInput,
  ReviewClaimInput,
} from './dto/event-entries.input';
import { Prisma } from '@bellona/db';

@Injectable()
export class EventEntriesService {
  constructor(private db: DatabaseProvider) {}

  async findByEvent(eventId: string, pagination?: PaginationInput) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.take ?? 50;

    const [entries, totalCount] = await Promise.all([
      this.db.eventEntry.findMany({
        where: { eventId },
        include: { user: true, members: { include: { user: true } } },
        orderBy: { createdAt: 'asc' },
        skip,
        take,
      }),
      this.db.eventEntry.count({ where: { eventId } }),
    ]);

    return {
      nodes: entries,
      totalCount,
      hasNextPage: skip + take < totalCount,
    };
  }

  async findById(id: string) {
    return this.db.eventEntry.findUnique({
      where: { id },
      include: {
        user: true,
        members: { include: { user: true } },
        claims: { include: { user: true } },
      },
    });
  }

  async addEntry(input: CreateEventEntryInput) {
    const event = await this.db.event.findUnique({
      where: { id: input.eventId },
      select: {
        requiresApproval: true,
        waitlistEnabled: true,
        maxParticipants: true,
      },
    });

    if (!event) throw new Error('Event not found');

    let entryStatus: 'CONFIRMED' | 'PENDING_APPROVAL' | 'WAITLISTED' =
      'CONFIRMED';

    if (event.requiresApproval) {
      entryStatus = 'PENDING_APPROVAL';
    } else if (event.maxParticipants !== null) {
      const confirmedCount = await this.db.eventEntry.count({
        where: { eventId: input.eventId, entryStatus: 'CONFIRMED' },
      });
      if (confirmedCount >= event.maxParticipants) {
        if (event.waitlistEnabled) {
          entryStatus = 'WAITLISTED';
        } else {
          throw new Error('Event is full');
        }
      }
    }

    return this.db.eventEntry.create({
      data: {
        eventId: input.eventId,
        displayName: input.displayName,
        imagePath: input.imagePath,
        userId: input.userId,
        entryStatus,
        stats: Prisma.JsonNull,
      },
      include: { user: true, members: true },
    });
  }

  async updateEntry(id: string, input: UpdateEventEntryInput) {
    return this.db.eventEntry.update({
      where: { id },
      data: input,
      include: { user: true, members: true },
    });
  }

  async claimEntry(entryId: string, userId: string, input: ClaimEntryInput) {
    return this.db.entryClaim.create({
      data: {
        entryId,
        userId,
        initiatedBy: 'USER' as never,
        status: 'PENDING',
        message: input.message,
      },
      include: { user: true },
    });
  }

  async reviewClaim(input: ReviewClaimInput, _reviewerId: string) {
    const claim = await this.db.entryClaim.findUnique({
      where: { id: input.claimId },
      include: { entry: true },
    });
    if (!claim) throw new Error('Claim not found');

    const updated = await this.db.entryClaim.update({
      where: { id: input.claimId },
      data: { status: input.status as never },
      include: { user: true },
    });

    // If approved, link the user to the entry
    if (input.status === 'APPROVED' && claim.entry.userId === null) {
      await this.db.eventEntry.update({
        where: { id: claim.entryId },
        data: { userId: claim.userId },
      });
    }

    return updated;
  }

  /**
   * Updates the `stats` JSON field for all entries in an event.
   * Called by the EntrySnapshotService cron after match results are processed.
   */
  async updateEntryStats(entryId: string, stats: Prisma.InputJsonValue) {
    return this.db.eventEntry.update({
      where: { id: entryId },
      data: { stats },
    });
  }
}
