import { Controller, Delete, Get, Param, Post, Put, Query, Session } from '@nestjs/common';
import { TagManageService } from './service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ADD_DTO, ID_DTO, RENAME_DTO, SORT_DTO, TAG_COUNT } from './class';
import { AuthManageService } from '../auth-manage/service';


@ApiTags('标签管理')
@Controller('/manage')
export class TagManageController {
  constructor(
    private readonly tagManageService: TagManageService,
    private readonly authService: AuthManageService,
    ) { }

  @Get('/tags/:id')
  @ApiOperation({
    summary: '获取各级标签'
  })
  @ApiResponse({ type: [TAG_COUNT] })
  @ApiParam({ name: 'id', type: Number, description: '标签父节点' })
  async list(@Param() param: ID_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.tagManageService.list(Number(param.id) || 0);
  }

  @Post('/tag/:id')
  @ApiOperation({
    summary: '新增标签'
  })
  @ApiParam({ name: 'id', type: Number, description: '标签父节点' })
  @ApiQuery({ name: 'name', type: String, description: '标签名' })
  async add(@Param() param: ID_DTO, @Query() query: ADD_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.tagManageService.add(query.name, Number(param.id) || 0);
  }

  @Put('/tag/:id/rename')
  @ApiOperation({
    summary: '修改标签名称'
  })
  @ApiParam({ name: 'id', type: Number, description: '标签ID' })
  @ApiQuery({ name: 'name', type: String, description: '标签名' })
  async rename(@Param() param: ID_DTO, @Query() query: RENAME_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.tagManageService.rename(Number(param.id), query.name);
  }
  @Put('/tag/:id/sort')
  @ApiOperation({
    summary: '修改标签顺序'
  })
  @ApiParam({ name: 'id', type: Number, description: '标签ID' })
  @ApiQuery({ name: 'sort', type: Number, description: '标签新位置' })
  async sort(@Param() param: ID_DTO, @Query() query: SORT_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.tagManageService.sort(Number(param.id), Number(query.sort));
  }
  @Delete('/tag/:id')
  @ApiOperation({
    summary: '删除标签'
  })
  @ApiParam({ name: 'id', type: Number, description: '标签ID' })
  async delete(@Param() param: ID_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.tagManageService.delete(Number(param.id));
  }
}
