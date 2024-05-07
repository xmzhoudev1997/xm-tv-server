import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum SOURCE_TYPE {
    网络资源 = 1,
  }

@Entity('source_info')
export class SOURCE_INFO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SOURCE_TYPE, default: SOURCE_TYPE.网络资源, comment: '资源类型' })
  type: number;

  @Column()
  content: string;

  @Column()
  performId: number;

}