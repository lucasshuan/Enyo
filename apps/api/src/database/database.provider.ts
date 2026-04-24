import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@bellona/db';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class DatabaseProvider extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString: databaseUrl, max: 5 });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
