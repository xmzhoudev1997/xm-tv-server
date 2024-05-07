import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TAG_INFO } from '../database-mysql/entity/tag';
import { TAG_COUNT } from './class';

@Injectable()
export class TagManageService {
  constructor(
    @InjectRepository(TAG_INFO)
    private tagDb: Repository<TAG_INFO>,
  ) {}
  list = async (parentId: number): Promise<TAG_COUNT[]> => {
    const tagList = await this.tagDb.find({
      select: ['id', 'name', 'parentId'],
      order: {
        sort: 'asc',
      }
    });
    const countMap: Record<number, number> = {};
    tagList.forEach((tag) => {
      if (countMap[tag.parentId] === undefined) {
        countMap[tag.parentId] = 0;
      }
      countMap[tag.parentId] += 1;
    })
    return tagList
    .filter(tag => tag.parentId === parentId)
    .map(tag => ({
      id: tag.id,
      name: tag.name,
      subCount: countMap[tag.id] || 0,
    }))
  }
  add = async(name: string, parentId = 0): Promise<TAG_INFO> => {
    const tagList = await this.tagDb.find({
      where: {
        parentId,
      }
    });
    if (tagList.find(d => d.name === name)) {
      throw new HttpException('标签已存在', HttpStatus.BAD_REQUEST);
    }
    const obj = {
      name,
      sort: tagList.length + 1,
      parentId,
    } as TAG_INFO;
    await this.tagDb.insert(obj);
    delete obj.parentId;
    return obj;
  }
  rename = async(id: number, name: string): Promise<TAG_INFO> => {
    const tag = await this.tagDb.findOne({ where: { id } });
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    const tagList = await this.tagDb.find({
      where: {
        parentId: tag.parentId,
      }
    });
    if (tagList.find(d => d.name === name && d.id !== tag.id)) {
      throw new HttpException('标签名已被使用', HttpStatus.BAD_REQUEST);
    }
    await this.tagDb.update(tag.id, { name });
    tag.name = name;
    delete tag.parentId;
    return tag;
  }
  sort = async(id: number, sort: number): Promise<void> => {
    const tag = await this.tagDb.findOne({ where: { id } });
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    const tagList = await this.tagDb.find({
      where: {
        parentId: tag.parentId,
      },
      order: {
        sort: 'asc'
      }
    });
    const oldSort = tagList.findIndex(d => d.id === tag.id);
    tagList.splice(oldSort, 1);
    tagList.splice(sort - 1, 0, tag);

    await Promise.all(tagList.map(async (d, i) => {
      if (d.sort !== i + 1) {
        return this.tagDb.update(d.id, { sort: i + 1 });
      }
    }))
  }
  delete = async(id: number): Promise<void> => {
    console.log(id);
    await this.tagDb.delete(id);
  }
}
