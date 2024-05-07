import { Body, Controller, Delete, Get, Param, Post, Put, Query, Response, Session } from '@nestjs/common';

import { PerformManageService } from './service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ADD_DTO, ID_DTO, PERFORM_ALL, SORT_DTO, SOURCE_DTO, UPDATE_DTO } from './class';
import { PerformScheduleService } from './schedule';
import { AuthManageService } from '../auth-manage/service';

@Controller('/manage')
@ApiTags('电视广播管理')
export class PerformManageController {
  constructor(
    private readonly service: PerformManageService,
    private readonly scheduleService: PerformScheduleService,
    private readonly authService: AuthManageService,
    ) {}
  @Get('/performs')
  @ApiOperation({
    summary: '获取全部节目信息'
  })
  @ApiResponse({ type: [PERFORM_ALL] })
  async list(@Session() session: any) {
    await this.authService.check(session);
    return this.service.list();
  }
  @Get('/perform/:id')
  @ApiOperation({
    summary: '获取单个资源'
  })
  @ApiParam({ name: 'id', type: Number, description: '节目ID' })
  async get(@Param() param: ID_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.service.get(Number(param.id));
  }
  @Post('/perform')
  @ApiOperation({
    summary: '新增节目'
  })
  @ApiBody({ type: ADD_DTO })
  async add(@Body() body: ADD_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.service.add(body);
  }
  @Put('/perform/:id')
  @ApiOperation({
    summary: '修改节目'
  })
  @ApiBody({ type: UPDATE_DTO })
  @ApiParam({ name: 'id', type: Number, description: '节目id' })
  async update(@Param() param: ID_DTO, @Body() body: UPDATE_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.service.update(Number(param.id), body);
  }
  @Put('/perform/:id/sort')
  @ApiOperation({
    summary: '修改顺序'
  })
  @ApiParam({ name: 'id', type: Number, description: '节目ID' })
  @ApiQuery({ name: 'sort', type: Number, description: '节目新位置' })
  async sort(@Param() param: ID_DTO, @Query() query: SORT_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.service.sort(Number(param.id), Number(query.sort));
  }
  @Put('/perform/:id/source')
  @ApiOperation({
    summary: '更新资源'
  })
  @ApiParam({ name: 'id', type: Number, description: '节目ID' })
  async updateSource(@Param() param: ID_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.scheduleService.update(Number(param.id));
  }
  @Delete('/perform/:id')
  @ApiOperation({
    summary: '删除节目'
  })
  @ApiParam({ name: 'id', type: Number, description: '节目id' })
  async delete(@Param() param: ID_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.service.delete(Number(param.id));
  }

  @Post('/perform/source')
  @ApiOperation({
    summary: '自动获取节目资源'
  })
  @ApiQuery({ name: 'kwd', type: String, description: '搜索关键字' })
  @ApiQuery({ name: 'num', type: Number, description: '搜索数量' })
  async source(@Query() query: SOURCE_DTO, @Session() session: any) {
    await this.authService.check(session);
    return this.scheduleService.search(query.kwd, Number(query.num) || 5);
  }

  @Post('/perform/sources')
  @ApiOperation({
    summary: '自动更新所有节目资源'
  })
  async updateAll(@Session() session: any) {
    await this.authService.check(session);
    return this.scheduleService.updateAll();
  }
}