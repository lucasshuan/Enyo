import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseProvider } from '../../database/database.provider';
import type { User } from '@ares/db';

export interface DiscordProfile {
  id: string;
  username: string;
  global_name?: string;
  email?: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private databaseProvider: DatabaseProvider,
    private jwtService: JwtService,
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

    // 2. If not, create user and account
    const imageUrl = avatar
      ? `https://cdn.discordapp.com/avatars/${providerAccountId}/${avatar}.png`
      : null;

    const user = await this.databaseProvider.user.create({
      data: {
        name: global_name || username,
        username: username,
        email: email,
        imageUrl: imageUrl,
        accounts: {
          create: {
            type: 'oauth',
            provider: provider,
            providerAccountId: providerAccountId,
          },
        },
      },
    });

    return user;
  }

  async login(user: User) {
    const permissions = await this.databaseProvider.userPermission.findMany({
      where: { userId: user.id },
      include: { permission: true },
    });

    const permissionKeys = permissions.map((p) => p.permission.key);

    const payload = {
      sub: user.id,
      username: user.username,
      imageUrl: user.imageUrl,
      isAdmin: user.isAdmin,
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
      throw new NotFoundException('User not found');
    }

    const permissions = await this.databaseProvider.userPermission.findMany({
      where: { userId: user.id },
      include: { permission: true },
    });

    return {
      id: user.id,
      username: user.username,
      imageUrl: user.imageUrl,
      isAdmin: user.isAdmin,
      permissions: permissions.map((p) => p.permission.key),
    };
  }
}
