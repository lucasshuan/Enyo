import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GameStaff } from './game-staff.model';
import { GameStaffService } from './game-staff.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/user.model';
import { GameStaffMemberInput } from './dto/game-staff.input';
import { DatabaseProvider } from '../../database/database.provider';

@Resolver(() => GameStaff)
export class GameStaffResolver {
  constructor(
    private gameStaffService: GameStaffService,
    private db: DatabaseProvider,
  ) {}

  @Query(() => [GameStaff], { name: 'gameStaff' })
  async getGameStaff(@Args('gameId', { type: () => ID }) gameId: string) {
    return this.gameStaffService.getStaff(gameId);
  }

  @Mutation(() => [GameStaff])
  @UseGuards(GqlAuthGuard)
  async setGameStaff(
    @Args('gameId', { type: () => ID }) gameId: string,
    @Args('members', { type: () => [GameStaffMemberInput] })
    members: GameStaffMemberInput[],
    @CurrentUser() user: User,
  ) {
    await this.assertCanManageStaff(gameId, user);
    return this.gameStaffService.setStaff(gameId, members);
  }

  @Mutation(() => GameStaff)
  @UseGuards(GqlAuthGuard)
  async removeGameStaff(
    @Args('gameId', { type: () => ID }) gameId: string,
    @Args('userId', { type: () => ID }) userId: string,
    @CurrentUser() user: User,
  ) {
    await this.assertCanManageStaff(gameId, user);
    return this.db.gameStaff.delete({
      where: { gameId_userId: { gameId, userId } },
    });
  }

  /**
   * Authorization for managing game staff:
   * - The game's author can always manage staff.
   * - Global admins (user.isAdmin) can always manage staff.
   * - Otherwise the user must hold the MANAGE_STAFF capability on the game.
   */
  private async assertCanManageStaff(gameId: string, user: User) {
    if (user.isAdmin) return;

    const game = await this.db.game.findUnique({
      where: { id: gameId },
      select: { authorId: true },
    });
    if (game?.authorId === user.id) return;

    const allowed = await this.gameStaffService.hasCapability(
      gameId,
      user.id,
      'MANAGE_STAFF',
    );
    if (!allowed) {
      throw new Error('You do not have permission to manage game staff');
    }
  }
}
