import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformManageService } from './service';
import { SOURCE_INFO } from '../database-mysql/entity/source';
import { PERFORM_INFO } from '../database-mysql/entity/perform';
import { PERFORM_TAG_RELA } from '../database-mysql/entity/perform_tag';
import { PerformManageController } from './controller';
import { PerformScheduleService } from './schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthManageModule } from '../auth-manage/module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SOURCE_INFO, PERFORM_INFO, PERFORM_TAG_RELA]),
    ScheduleModule.forRoot(),
    AuthManageModule,
  ],
  exports: [PerformManageService],
  providers: [PerformManageService, PerformScheduleService],
  controllers: [PerformManageController]
})
export class PerformManageModule { }