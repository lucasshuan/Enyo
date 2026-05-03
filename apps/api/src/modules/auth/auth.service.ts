import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { DatabaseProvider } from '../../database/database.provider';
import { StorageService } from '../storage/storage.service';
import type { User } from '@bellona/db';

export interface DiscordProfile {
  id: string;
  username: string;
  global_name?: string;
  email?: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private databaseProvider: DatabaseProvider,
    private jwtService: JwtService,
    private storageService: StorageService,
  ) {}

  async validateDiscordUser(profile: DiscordProfile) {
    const {
      id: providerAccountId,
      username,
      global_name,
      email,
      avatar,
    } = profile;
    const provider = 'discord';

    // 1. Check if account already exists
    const existingAccount = await this.databaseProvider.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    if (existingAccount) {
      return existingAccount.user;
    }

    // 2. If not, create user and account (without avatar first)
    const user = await this.databaseProvider.user.create({
      data: {
        name: global_name || username,
        username: username,
        email: email,
        accounts: {
          create: {
            type: 'oauth',
            provider: provider,
            providerAccountId: providerAccountId,
          },
        },
      },
    });

    // Upload Discord avatar to users/{id}/ now that we have the user ID
    const imageUrl = await this.uploadDiscordAvatar(
      user.id,
      providerAccountId,
      avatar,
    );
    if (imageUrl) {
      await this.databaseProvider.user.update({
        where: { id: user.id },
        data: { imagePath: imageUrl },
      });
      return { ...user, imagePath: imageUrl };
    }

    return user;
  }

  private async uploadDiscordAvatar(
    userId: string,
    providerAccountId: string,
    avatar: string | undefined,
  ): Promise<string | null> {
    if (!avatar) return null;

    const discordUrl = `https://cdn.discordapp.com/avatars/${providerAccountId}/${avatar}.png`;

    try {
      const response = await fetch(discordUrl);

      if (!response.ok) {
        this.logger.warn(
          `Failed to fetch Discord avatar (${response.status}): ${discordUrl}`,
        );
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') ?? 'image/png';
      const path = `users/${userId}/${randomUUID()}.png`;

      return await this.storageService.uploadBuffer(buffer, contentType, path);
    } catch {
      this.logger.warn('Could not upload Discord avatar to CDN');
      return null;
    }
  }

  async login(user: User) {
    const permissions = await this.databaseProvider.userPermission.findMany({
      where: { userId: user.id },
    });

    const permissionKeys = permissions.map((p) => p.key);

    const payload = {
      sub: user.id,
      username: user.username,
      imageUrl: user.imagePath,
      isAdmin: user.isAdmin,
      onboardingCompleted: user.onboardingCompleted,
      permissions: permissionKeys,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        ...user,
        permissions: permissionKeys,
      },
    };
  }

  async createAuthCode(token: string): Promise<string> {
    const code =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.databaseProvider.authCode.create({
      data: {
        code,
        token,
        expiresAt,
      },
    });

    return code;
  }

  async exchangeCode(code: string): Promise<string | null> {
    const authCode = await this.databaseProvider.authCode.findUnique({
      where: { code },
    });

    if (!authCode) return null;

    if (authCode.expiresAt < new Date()) {
      await this.databaseProvider.authCode.delete({
        where: { id: authCode.id },
      });
      return null;
    }

    await this.databaseProvider.authCode.delete({
      where: { id: authCode.id },
    });

    return authCode.token;
  }

  async getSessionData(userId: string) {
    const user = await this.databaseProvider.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const permissions = await this.databaseProvider.userPermission.findMany({
      where: { userId: user.id },
    });

    return {
      id: user.id,
      username: user.username,
      imageUrl: user.imagePath,
      isAdmin: user.isAdmin,
      onboardingCompleted: user.onboardingCompleted,
      permissions: permissions.map((p) => p.key),
    };
  }
}
