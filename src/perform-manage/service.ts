import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SOURCE_INFO, SOURCE_TYPE } from '../database-mysql/entity/source';
import { PERFORM_INFO, PERFORM_TYPE } from '../database-mysql/entity/perform';
import { PERFORM_TAG_RELA } from '../database-mysql/entity/perform_tag';
import { PERFORM_ALL } from './class';

@Injectable()
export class PerformManageService {
  constructor(
    @InjectRepository(SOURCE_INFO)
    private sourceDb: Repository<SOURCE_INFO>,
    @InjectRepository(PERFORM_INFO)
    private performDb: Repository<PERFORM_INFO>,
    @InjectRepository(PERFORM_TAG_RELA)
    private performTagDb: Repository<PERFORM_TAG_RELA>,
  ) { }
  list = async (): Promise<PERFORM_ALL[]> => {
    const performList = await this.performDb.find({
      where: {
        type: PERFORM_TYPE.电视广播,
      },
      select: ['id', 'name', 'search', 'schedule'],
      order: {
        sort: 'asc'
      }
    });
    const idList = performList.map(d => d.id);
    if (!idList.length) {
      return [];
    }
    const [sourceList, tagRelaList] = await Promise.all([
      this.sourceDb.find({
        where: {
          type: SOURCE_TYPE.网络资源,
          performId: In(idList),
        },
        select: ['performId', 'content'],
      }),
      this.performTagDb.find({
        where: {
          performId: In(idList),
        },
        select: ['performId', 'tagId'],
      })
    ])
    const sourceMap: Record<number, string[]> = {};
    sourceList.forEach((d) => {
      if (!sourceMap[d.performId]) {
        sourceMap[d.performId] = [];
      }
      sourceMap[d.performId].push(d.content);
    })
    const tagMap: Record<number, number> = {};
    tagRelaList.forEach((d) => {
      tagMap[d.performId] = d.tagId;
    })
    return performList.map(d => ({
      id: d.id,
      name: d.name,
      search: d.search,
      tagId: tagMap[d.id],
      sources: sourceMap[d.id] || [],
      schedule: d.schedule,
    }))
  }
  get = async (id: number): Promise<PERFORM_ALL> => {
    const data = await this.performDb.findOne({
      where: {
        type: PERFORM_TYPE.电视广播,
        id,
      },
      select: ['id', 'name', 'search', 'schedule'],
      order: {
        sort: 'asc'
      }
    });
    const [sourceList, tagRelaList] = await Promise.all([
      this.sourceDb.find({
        where: {
          type: SOURCE_TYPE.网络资源,
          performId: id,
        },
        select: ['performId', 'content'],
      }),
      this.performTagDb.find({
        where: {
          performId: id,
        },
        select: ['performId', 'tagId'],
      })
    ])
    const sourceMap: Record<number, string[]> = {};
    sourceList.forEach((d) => {
      if (!sourceMap[d.performId]) {
        sourceMap[d.performId] = [];
      }
      sourceMap[d.performId].push(d.content);
    })
    const tagMap: Record<number, number> = {};
    tagRelaList.forEach((d) => {
      tagMap[d.performId] = d.tagId;
    })
    return {
      id: data.id,
      name: data.name,
      search: data.search,
      tagId: tagMap[data.id],
      sources: sourceMap[data.id] || [],
      schedule: data.schedule,
    }
  }
  add = async (data: Omit<PERFORM_ALL, 'id'>): Promise<void> => {
    if (!data.name?.trim()) {
      throw new HttpException('节目名称不能为空', HttpStatus.BAD_REQUEST);
    }
    const [count, perform] = await Promise.all([
      this.performDb.count({
        where: {
          type: PERFORM_TYPE.电视广播,
        },
      }),
      this.performDb.findOne({
        where: {
          type: PERFORM_TYPE.电视广播,
          name: data.name,
        },
      }),
    ]);
    if (perform) {
      throw new HttpException('节目已存在', HttpStatus.BAD_REQUEST);
    }
    const obj = {
      name: data.name,
      search: data.search,
      sort: count + 1,
      schedule: data.schedule,
    } as PERFORM_INFO;
    await this.performDb.insert(obj);
    await Promise.all([
      this.updateSources(obj.id, data.sources),
      this.performTagDb.insert({
        performId: obj.id,
        tagId: data.tagId,
      }),
    ]);
  }
  update = async (performId: number, data: Partial<PERFORM_ALL>): Promise<void> => {
    if (!data.name?.trim()) {
      throw new HttpException('节目名称不能为空', HttpStatus.BAD_REQUEST);
    }
    const perform = await this.performDb.find({
      where: {
        type: PERFORM_TYPE.电视广播,
        name: data.name,
      },
    });
    if (perform.find(d => d.id !== performId)) {
      throw new HttpException('节目名称已被使用', HttpStatus.BAD_REQUEST);
    }
    await this.performDb.update(performId, {
      name: data.name,
      search: data.search,
      schedule: data.schedule,
    });
    await this.updateSources(performId, data.sources);
    const performTagRela = await this.performTagDb.findOne({
      where: { performId },
    });
    if (performTagRela) {
      if (performTagRela.tagId !== data.tagId) {
        await this.performTagDb.update(performTagRela.id, {
          tagId: data.tagId,
        });
      }
    } else {
      await this.performTagDb.insert({
        performId,
        tagId: data.tagId,
      });
    }
  }
  delete = async (performId: number): Promise<void> => {
    await this.performDb.delete(performId);
    await this.sourceDb.delete({
      performId,
    });
    await this.performTagDb.delete({
      performId,
    });
  }
  updateSources = async (performId: number, sources: string[]) => {
    const oldSourceList = await this.sourceDb.find({
      where: {
        type: SOURCE_TYPE.网络资源,
        performId,
      }
    });
    for (const source of oldSourceList) {
      if (sources.includes(source.content)) {
        continue;
      } else {
        await this.sourceDb.delete(source.id);
      }
    }
    for (const source of sources) {
      if (oldSourceList.find(d => d.content === source)) {
        continue;
      } else {
        await this.sourceDb.insert({
          performId,
          content: source,
          type: SOURCE_TYPE.网络资源,
        });
      }
    }
  }
  sort = async(id: number, sort: number): Promise<void> => {
    const list = await this.performDb.find({
      where: {
        type: PERFORM_TYPE.电视广播,
      },
      order: {
        sort: 'asc'
      }
    });
    const oldSort = list.findIndex(d => d.id === id);
    const [oldData] = list.splice(oldSort, 1);
    list.splice(sort - 1, 0, oldData);

    await Promise.all(list.map(async (d, i) => {
      if (d.sort !== i + 1) {
        return this.performDb.update(d.id, { sort: i + 1 });
      }
    }))
  }
}
