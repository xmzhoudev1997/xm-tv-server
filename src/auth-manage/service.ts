import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AuthManageService {
  constructor(
    readonly redisService: RedisService
  ) {}
  add = async (token: string, session: any): Promise<void> => {
    const client = this.redisService.getClient();
    const secret = await client.get('XMTV_CONFIG_ADMIN_SECRER');
    if (token !== secret) {
      throw new HttpException('无权操作', HttpStatus.UNAUTHORIZED)
    }
    session.auth = true;
  }
  get = async (session: any): Promise<boolean> => {
    return !!session.auth;
  }
  check = async (session: any): Promise<void> => {
    if (!session.auth) {
      throw new HttpException('无权操作', HttpStatus.UNAUTHORIZED)
    }
  }
}
