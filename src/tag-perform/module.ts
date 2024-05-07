import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagPerformController } from './controller';
import { TagPerformService } from './service';
import { TAG_INFO } from '../database-mysql/entity/tag';
import { SOURCE_INFO } from '../database-mysql/entity/source';
import { PERFORM_INFO } from '../database-mysql/entity/perform';
import { PERFORM_TAG_RELA } from '../database-mysql/entity/perform_tag';

@Module({
  imports: [TypeOrmModule.forFeature([TAG_INFO, SOURCE_INFO, PERFORM_INFO, PERFORM_TAG_RELA])],
  controllers: [TagPerformController],
  providers: [TagPerformService]
})
export class TagPerformModule {}