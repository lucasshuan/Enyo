import {
  Args,
  ID,
  ObjectType,
  Field,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequiredPermissions } from '../auth/decorators/required-permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Game } from './game.model';
import { GamesService } from './games.service';
import { User } from '../auth/user.model';
import { CreateGameInput, UpdateGameInput } from './dto/games.input';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { PaginatedGames } from './dto/games.output';
import { DataLoaderService } from '../../common/dataloaders/dataloader.service';

@ObjectType()
export class EventMeta {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;
}

@Resolver(() => Game)
export class GamesResolver {
  constructor(
    private gamesService: GamesService,
    private dataLoaderService: DataLoaderService,
  ) {}

  @Query(() => PaginatedGames, { name: 'games' })
  async getGames(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('search', { nullable: true }) search?: string,
  ) {
    return this.gamesService.findAll(
      pagination || new PaginationInput(),
      search,
    );
  }

  @Query(() => Game, { name: 'game', nullable: true })
  async getGameBySlug(@Args('slug') slug: string) {
    return this.gamesService.findBySlug(slug);
  }

  @ResolveField(() => User, { name: 'author', nullable: true })
  async getAuthor(@Parent() game: Game) {
    if (!game.authorId) {
      return null;
    }

    return this.dataLoaderService.userLoader.load(game.authorId);
  }

  @Query(() => EventMeta, { name: 'eventMeta', nullable: true })
  async getEventMeta(
    @Args('gameSlug') gameSlug: string,
    @Args('slug') slug: string,
  ) {
    return this.gamesService.findEventMeta(gameSlug, slug);
  }

  @Query(() => Boolean, { name: 'checkGameSlug' })
  async checkGameSlug(
    @Args('slug') slug: string,
    @Args('excludeId', { type: () => ID, nullable: true }) excludeId?: string,
  ): Promise<boolean> {
    return this.gamesService.checkSlug(slug, excludeId);
  }

  @Mutation(() => Game)
  @UseGuards(GqlAuthGuard)
  async createGame(
    @Args('input') input: CreateGameInput,
    @CurrentUser() user: User,
  ) {
    return this.gamesService.create(input, user.id);
  }

  @Mutation(() => Game)
  @UseGuards(GqlAuthGuard)
  async updateGame(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateGameInput,
    @CurrentUser() user: User,
  ) {
    // Se o usuário não for admin, o service verificará ownership
    return this.gamesService.update(
      id,
      input,
      user.isAdmin ? undefined : user.id,
    );
  }

  @Mutation(() => Game)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequiredPermissions('manage_games')
  async approveGame(@Args('id', { type: () => ID }) id: string) {
    return this.gamesService.approve(id);
  }

  @Mutation(() => Game)
  @UseGuards(GqlAuthGuard)
  async deleteGame(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.gamesService.delete(id, user.isAdmin ? undefined : user.id);
  }
}
