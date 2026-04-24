import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { join, resolve } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { StorageModule } from './modules/storage/storage.module';
import { LeaguesModule } from './modules/leagues/leagues.module';
import { EventEntriesModule } from './modules/event-entries/event-entries.module';
import { MatchesModule } from './modules/matches/matches.module';
import { EventStaffModule } from './modules/event-staff/event-staff.module';
import { parseEnv } from './env';
import { CommonModule } from './common/common.module';
import { pinoLoggerConfig } from './common/configs/pino-logger.config';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(process.cwd(), '.env')],
      validate: (config) => parseEnv(config),
    }),
    LoggerModule.forRoot(pinoLoggerConfig),
    CommonModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: !isProduction,
          introspection: !isProduction,
          cache: new InMemoryLRUCache({ maxSize: 30_000_000 }),
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuditModule,
    GamesModule,
    AuthModule,
    EventsModule,
    UsersModule,
    StorageModule,
    LeaguesModule,
    EventEntriesModule,
    MatchesModule,
    EventStaffModule,
  ],
})
export class AppModule {}
