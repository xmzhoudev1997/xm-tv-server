import { Module } from '@nestjs/common';
import { TagPerformModule } from '../tag-perform/module';
import { TagManageModule } from '../tag-manage/module';
import { PerformManageModule } from '../perform-manage/module';
import { SessionModule } from 'nestjs-session';
import { ConfigModule } from '@nestjs/config';
import { DBMysqlModule } from 'src/database-mysql/module';
import { DBRedisModule } from 'src/database-redis/module';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DBMysqlModule,
    SessionModule.forRootAsync({
      imports: [DBRedisModule],
      useFactory: async (redisService: RedisService) => {
        const client = redisService.getClient();
        const secret = await client.get('XMTV_CONFIG_SESSION_SECRER');
        return {
          session: {
            secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
              maxAge: 3600000,
            },
          },
        }
      },
      inject: [RedisService]
    }),
    TagPerformModule, TagManageModule, PerformManageModule, TagManageModule,
  ],
})
export class AppModule {}
