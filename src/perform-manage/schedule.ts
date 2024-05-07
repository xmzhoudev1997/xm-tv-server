import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PERFORM_INFO } from '../database-mysql/entity/perform';
import { PerformManageService } from './service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PerformScheduleService {
  constructor(
    @InjectRepository(PERFORM_INFO)
    private performDb: Repository<PERFORM_INFO>,
    private service: PerformManageService,
  ) { }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateAll() {
    const performList = await this.performDb.find();
    const kwdName = await this.getKwdName();
    if (!kwdName) {
      return;
    }
    for (const perform of performList) {
      if (!perform.schedule || !perform.search) {
        continue;
      }
      const list: { name: string, url: string }[] = [];
      await this.getSource(kwdName, perform.search, list);
      if (list.length) {
        await this.service.updateSources(perform.id, list.map(d => d.url));
      }
    }
  }
  async update(id: number) {
    const perform = await this.performDb.findOne({
      where: {
        id,
      }
    });
    const kwdName = await this.getKwdName();
    if (!kwdName) {
      return;
    }
    if (!perform || !perform.schedule || !perform.search) {
      return;
    }
    const list: { name: string, url: string }[] = [];
    await this.getSource(kwdName, perform.search, list);
    if (list.length) {
      await this.service.updateSources(perform.id, list.map(d => d.url));
    }
  }
  async search(kwd: string, maxNum = 5) {
    const kwdName = await this.getKwdName();
    if (!kwdName || !kwd?.trim()) {
      return [];
    }
    const list: { name: string, url: string }[] = [];
    await this.getSource(kwdName, kwd.trim(), list, 1, undefined, maxNum);
    return list;
  }
  getSource = async (kwdName: string, kwd: string, list: { name: string, url: string }[], pageIndex = 1, cookieStr = '', maxNum = 5) => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('page', String(pageIndex));
    urlSearchParams.set(kwdName, kwd);
    const [cookie, text] = await axios(`http://tonkiang.us/?${urlSearchParams.toString()}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStr,
      }
    }).then(async res => {
      return [res.headers['set-cookie']?.join('; '), await res.data];
    });
    const $ = cheerio.load(text);
    let flag = false, index = 0;
    for (const element of $('.resultplus')) {
      if (index === 0) {
        index += 1;
        continue;
      }
      const name = $(element).find('a').first().text().trim();
      const link = $(element).find('tba').last().text().trim();
      if (name && link && link.endsWith('.m3u8') && /http(s)?:\/\/[a-zA-Z]+.*?/.test(link)) {
        flag = true;
        list.push({
          name,
          url: link
        });
      }
      index += 1;
    }
    if (flag && list.length < maxNum) {
      await this.getSource(kwdName, kwd, list, pageIndex + 1, cookie || cookieStr, maxNum);
    }
  }
  getKwdName = async () => {
    const text = await axios(`http://tonkiang.us`, {
      method: 'GET',
    }).then(async res => res.data);
    const $ = cheerio.load(text);
    const str = $('.box').eq(2).find('.sh').eq(2).find('a').attr('href') || '';
    return str.split('?')[1]?.split('=')[0];
  }
}