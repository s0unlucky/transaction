/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { FindTransactionParams, TransactionStatus } from './transaction.types';

export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async createTransaction<T extends DeepPartial<TransactionEntity>>(
    entity: T,
  ): Promise<TransactionEntity> {
    return this.transactionRepository.save(entity);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.transactionRepository.update({ id }, { status });
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    return this.transactionRepository.findOneBy({ id });
  }

  qb(params: FindTransactionParams = {}, alias= 'transaction'): SelectQueryBuilder<TransactionEntity> {
    const { userIds, ids, amounts, type, status, take, skip } = params;
    const query = this.transactionRepository.createQueryBuilder(alias);

    if (userIds?.length) {
      query.andWhere(`${alias}.userId in (:...userIds)`, { userIds });
    }

    if (ids?.length) {
      query.andWhere(`${alias}.id in (:...ids)`, { ids });
    }

    if (amounts?.length) {
      query.andWhere(`${alias}.amount in (:...amounts)`, { amounts });
    }

    if (type) {
      query.andWhere(`${alias}.type = :type`, { type });
    }

    if (status) {
      query.andWhere(`${alias}.status = :status`, { status });
    }

    //Paginate
    if (take) {
      query.take(take);
    }
    if (skip) {
      query.skip(skip);
    }

    return query;
  }

  async findByParams(params: FindTransactionParams = {}): Promise<{
    items: TransactionEntity[];
    total: number;
    }> {
    const query = this.qb(params);
    
    // Получаем и записи, и общее количество
    const [items, total] = await query.getManyAndCount();
    
    return { items, total };
  }
}
