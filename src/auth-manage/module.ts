import { Module } from '@nestjs/common';
import { AuthManageService } from './service';
import { AuthManageController } from './controller';
import { DBRedisModule } from 'src/database-redis/module';

@Module({
  imports: [DBRedisModule],
  exports: [AuthManageService],
  providers: [AuthManageService],
  controllers: [AuthManageController]
})
export class AuthManageModule { }