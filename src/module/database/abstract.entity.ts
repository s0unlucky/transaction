/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity {
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
