import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TAG_INFO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  parentId: number;

  @Column()
  sort: number;

}