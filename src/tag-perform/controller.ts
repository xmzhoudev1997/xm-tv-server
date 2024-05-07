import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagPerformService } from './service';
import { PERFORM_TAG } from './class';
import { ID_DTO } from '../perform-manage/class';


@ApiTags('电视直播')
@Controller('/perform')
@Controller()
export class TagPerformController {
  constructor(
    private readonly service: TagPerformService,
    ) {}
  @Get('/tags')
  @ApiOperation({
    summary: '获取电视广播目录'
  })
  @ApiResponse({ type: [PERFORM_TAG] })
  tags() {
    return this.service.list();
  }
  @Get('/:id/sources')
  @ApiOperation({
    summary: '获取电视广播列表'
  })
  @ApiResponse({ type: [String] })
  @ApiParam({ name: 'id', type: Number, description: '节目id' })
  list(@Param() param: ID_DTO) {
    return this.service.sources(Number(param.id));
  }
}
