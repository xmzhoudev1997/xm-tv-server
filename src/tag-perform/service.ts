import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TAG_INFO } from '../database-mysql/entity/tag';
import { PERFORM_INFO } from '../database-mysql/entity/perform';
import { PERFORM_TAG_RELA } from '../database-mysql/entity/perform_tag';
import { PERFORM_SIMPLE, PERFORM_TAG } from './class';
import { SOURCE_INFO } from '../database-mysql/entity/source';

@Injectable()
export class TagPerformService {
  constructor(
    @InjectRepository(TAG_INFO)
    private tagDb: Repository<TAG_INFO>,
    @InjectRepository(PERFORM_INFO)
    private performDb: Repository<PERFORM_INFO>,
    @InjectRepository(PERFORM_TAG_RELA)
    private performTagDb: Repository<PERFORM_TAG_RELA>,
    @InjectRepository(SOURCE_INFO)
    private sourceDb: Repository<SOURCE_INFO>,
  ) {}
  list = async (): Promise<PERFORM_TAG[]> => {
    const tagList = await this.tagDb.find({
      select: ['id', 'name'],
      where: {
        parentId: 1,
      },
      order: {
        sort: 'asc'
      }
    });
    const tagIdList = tagList.map(d => d.id);
    if (!tagIdList.length) {
      return [];
    }
    const relaMap: Record<number, PERFORM_SIMPLE[]> = {};
    const relaList = await this.performTagDb.find({
      select: ['performId', 'tagId'],
      where: {
        tagId: In(tagIdList),
      },
    })
    const performIdList = relaList.map(d => d.performId);
    if (!performIdList.length) {
      return [];
    }
    const performList = await this.performDb.find({
      select: ['id', 'name'],
      where: {
        id: In(performIdList),
      },
      order: {
        sort: 'asc'
      }
    });
    const map: Record<number, string> = {};
    performList.forEach(d => {
      map[d.id] = d.name;
    })
    relaList.forEach(d => {
      if (!relaMap[d.tagId]) {
        relaMap[d.tagId] = [];
      }
      relaMap[d.tagId].push({ id: d.performId, name: map[d.performId] });
    })
    return tagList.map(d => ({
      name: d.name,
      children: relaMap[d.id],
    })).filter(d => d.children?.length);
  }
  sources = async (performId: number): Promise<string[]> => {
    const tagList = await this.sourceDb.find({
      select: ['content'],
      where: {
        performId,
      }
    });
    return tagList.map(d => d.content);
  }
}
