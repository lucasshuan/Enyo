import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';

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

    // Move tmp upload to permanent location, delete old file if replaced
    if (input.imagePath !== undefined) {
      const current = await this.databaseProvider.user.findUnique({
        where: { id: userId },
        select: { imagePath: true },
      });

      if (input.imagePath && this.storageService.isTmpPath(input.imagePath)) {
        const filename = input.imagePath.split('/').pop()!;
        const destPath = `users/${userId}/${filename}`;
        input = {
          ...input,
          imagePath: await this.storageService.moveFile(
            input.imagePath,
            destPath,
          ),
        };
      }

      if (current?.imagePath && current.imagePath !== input.imagePath) {
        await this.storageService.deleteFile(current.imagePath);
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
    const exists = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (!exists) {
      throw new UnauthorizedException('User not found');
    }

    return this.databaseProvider.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    });
  }
}
