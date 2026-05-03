import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventStaff } from './event-staff.model';
import { EventStaffService } from './event-staff.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/user.model';
import { AddEventStaffInput } from './dto/event-staff.input';

@Resolver(() => EventStaff)
export class EventStaffResolver {
  constructor(private eventStaffService: EventStaffService) {}

  @Query(() => [EventStaff], { name: 'eventStaff' })
  async getEventStaff(@Args('eventId', { type: () => ID }) eventId: string) {
    return this.eventStaffService.getStaff(eventId);
  }

  @Mutation(() => EventStaff)
  @UseGuards(GqlAuthGuard)
  async upsertEventStaff(
    @Args('input') input: AddEventStaffInput,
    @CurrentUser() user: User,
  ) {
    await this.assertCanManageStaff(input.eventId, user.id);
    return this.eventStaffService.upsertStaff(
      input.eventId,
      input.userId,
      input.capabilities ?? [],
      input.isFullAccess ?? false,
    );
  }

  @Mutation(() => EventStaff)
  @UseGuards(GqlAuthGuard)
  async removeEventStaff(
    @Args('eventId', { type: () => ID }) eventId: string,
    @Args('userId', { type: () => ID }) userId: string,
    @CurrentUser() user: User,
  ) {
    await this.assertCanManageStaff(eventId, user.id);
    return this.eventStaffService.removeStaff(eventId, userId);
  }

  private async assertCanManageStaff(eventId: string, userId: string) {
    const canManage = await this.eventStaffService.hasCapability(
      eventId,
      userId,
      'MANAGE_STAFF',
    );
    if (!canManage) {
      throw new Error('You do not have permission to manage event staff');
    }
  }
}
