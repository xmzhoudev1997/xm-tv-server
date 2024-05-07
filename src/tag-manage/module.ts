import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TAG_INFO } from '../database-mysql/entity/tag';
import { TagManageController } from './controller';
import { AuthManageModule } from '../auth-manage/module';
import { TagManageService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([TAG_INFO]), AuthManageModule],
  controllers: [TagManageController],
  providers: [TagManageService]
})
export class TagManageModule {}