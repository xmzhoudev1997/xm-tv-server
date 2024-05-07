import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PERFORM_TAG_RELA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  performId: number;

  @Column()
  tagId: number;
}