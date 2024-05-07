import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';

import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TOKEN_DTO } from './class';
import { AuthManageService } from './service';

@Controller('/manage')
@ApiTags('授权管理')
export class AuthManageController {
  constructor(
    private readonly service: AuthManageService,
  ) {}
  @Post('/auth/:token')
  @ApiOperation({
    summary: '授权系统管理'
  })
  @ApiParam({ name: 'token', type: String, description: '密码' })
  async add(@Param() param: TOKEN_DTO, @Session() session: any) {
    return this.service.add(param.token, session);
  }
  @Get('/auth')
  @ApiOperation({
    summary: '检查授权'
  })
  check(@Session() session: any) {
    return this.service.get(session);
  }
}