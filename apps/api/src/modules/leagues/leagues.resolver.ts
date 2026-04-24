import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { League } from './league.model';
import { LeaguesService } from './leagues.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/user.model';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { PaginatedLeagues } from './dto/leagues.output';
import {
  CreateLeagueEventInput,
  CreateLeagueConfigInput,
  UpdateLeagueEventInput,
  UpdateLeagueConfigInput,
  InitialStaffInput,
} from './dto/leagues.input';

@Resolver(() => League)
export class LeaguesResolver {
  constructor(private leaguesService: LeaguesService) {}

  @Query(() => League, { name: 'league', nullable: true })
  async getLeague(
    @Args('gameSlug') gameSlug: string,
    @Args('slug') slug: string,
  ) {
    return this.leaguesService.findByEventSlug(gameSlug, slug);
  }

  @Query(() => PaginatedLeagues, { name: 'leagues' })
  async getLeagues(
    @Args('gameId') gameId: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return this.leaguesService.findAllByGame(
      gameId,
      pagination ?? new PaginationInput(),
    );
  }

  @Mutation(() => League)
  @UseGuards(GqlAuthGuard)
  async createLeague(
    @Args('event') eventInput: CreateLeagueEventInput,
    @Args('league') leagueInput: CreateLeagueConfigInput,
    @Args('staff', { type: () => [InitialStaffInput], nullable: true })
    staff: InitialStaffInput[] | undefined,
    @CurrentUser() user: User,
  ) {
    return this.leaguesService.create(eventInput, leagueInput, user.id, staff);
  }

  @Mutation(() => League)
  @UseGuards(GqlAuthGuard)
  async updateLeague(
    @Args('eventId', { type: () => ID }) eventId: string,
    @Args('event', { nullable: true }) eventInput?: UpdateLeagueEventInput,
    @Args('league', { nullable: true }) leagueInput?: UpdateLeagueConfigInput,
  ) {
    return this.leaguesService.update(eventId, eventInput, leagueInput);
  }
}
