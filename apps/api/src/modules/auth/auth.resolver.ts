import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from './user.model';
import { GqlAuthGuard } from './gql-auth.guard';
import { DatabaseProvider } from '../../database/database.provider';
import { UpdateProfileInput } from './dto/auth.input';
import { CurrentUser } from './decorators/current-user.decorator';
import { StorageService } from '../storage/storage.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private databaseProvider: DatabaseProvider,
    private storageService: StorageService,
  ) {}

  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser() user: { id: string }) {
    return this.databaseProvider.user.findFirst({
      where: {
        id: user.id,
      },
    });
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateProfileInput,
  ) {
    const userId = user.id;

    // Simple availability check
    if (input.username) {
      const existing = await this.databaseProvider.user.findFirst({
        where: { username: input.username, id: { not: userId } },
      });
      if (existing) throw new Error('Username taken');
    }

    // Delete old CDN image if being replaced
    if (input.imageUrl !== undefined) {
      const current = await this.databaseProvider.user.findUnique({
        where: { id: userId },
        select: { imageUrl: true },
      });
      if (current?.imageUrl && current.imageUrl !== input.imageUrl) {
        await this.storageService.deleteFile(current.imageUrl);
      }
    }

    return this.databaseProvider.user.update({
      where: { id: userId },
      data: {
        ...input,
      },
    });
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async completeOnboarding(@CurrentUser() user: { id: string }) {
    return this.databaseProvider.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    });
  }
}
