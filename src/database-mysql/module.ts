import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TAG_INFO } from './entity/tag';
import { PERFORM_INFO } from './entity/perform';
import { PERFORM_TAG_RELA } from './entity/perform_tag';
import { SOURCE_INFO } from './entity/source';
import { DBRedisModule } from 'src/database-redis/module';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DBRedisModule],
      useFactory: async (redisService: RedisService) => {
        const client = redisService.getClient();
        const host = await client.get('XMTV_CONFIG_MYSQL_HOST');
        const port = await client.get('XMTV_CONFIG_MYSQL_PORT');
        const username = await client.get('XMTV_CONFIG_MYSQL_USER');
        const password = await client.get('XMTV_CONFIG_MYSQL_PWD');
        const database = await client.get('XMTV_CONFIG_MYSQL_DB');
        return {
          type: 'mysql',
          host,
          port: Number(port),
          username,
          password,
          database,
          entities: [SOURCE_INFO, TAG_INFO, PERFORM_TAG_RELA, PERFORM_INFO],
        };
      },
      inject: [RedisService]
    })
  ],
})
export class DBMysqlModule {}