import { TransactionStatus, TransactionType } from '../transaction.types';
import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'transaction',
})
export class TransactionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Индентификатор транзакции',
    name: 'transaction_id',
  })
  readonly id: string;

  @Column('varchar', {
    comment: 'Индентификатор пользователя, совершающего транзакцию',
    nullable: false,
  })
  userId: string;

  @Column('varchar', {
    comment: 'Сумма транзакций в копейках',
    nullable: false,
  })
  amount: string;

  @Column('enum', {
    comment: 'Тип транзакции',
    name: 'type',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('enum', {
    comment: 'Статус транзакции',
    name: 'status',
    nullable: false,
    enum: TransactionStatus,
    default: TransactionStatus.INPROGRESS,
  })
  status?: TransactionStatus;
}
