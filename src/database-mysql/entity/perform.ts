import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { SOURCE_INFO } from './source';
import { TAG_INFO } from './tag';

export enum PERFORM_TYPE {
    电视广播 = 1,
  }

@Entity()
export class PERFORM_INFO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PERFORM_TYPE, default: PERFORM_TYPE.电视广播 })
  type: number;

  @Column()
  name: string;

  @Column()
  parentId: number;

  @Column()
  search: string;

  @Column()
  sort: number;

  @Column()
  schedule: number;
}