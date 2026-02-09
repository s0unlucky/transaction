/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { BalanceChangedStatus, EventBalanceChangedData, EventNameEnum, EventTransactionSavedData, TransactionStatus, TransactionType } from './transaction.types';
import { TransactionDto } from './dto/transaction-dto.ts';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GetTransactionFilterDto } from './dto/get-transaction-filter-dto';
import { InternalAccountService } from '../../internal/account.service';
import { KafkaService } from '../../config/kafka/kafka.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly internalAccountService: InternalAccountService,
    private readonly kafkaService: KafkaService,
) {}

  async create(params: CreateTransactionDto): Promise<void> {
    const { userId, amount, transactionType, recipient } = params;

    if (transactionType == TransactionType.TRANSFER && recipient) {
      return this.createTransferTransaction(params);
    }

    let formattedAmount = amount;
    let transaction;
    let actualTransactionType = transactionType;

    if (transactionType === TransactionType.WITHDRAW) {
    // Для снятия добавляем минус, если его нет
      if (!amount.startsWith('-')) {
        formattedAmount = '-' + amount;
      }
      actualTransactionType = TransactionType.WITHDRAW;
  } else {
    // Для пополнения убираем минус, если он есть
      if (amount.startsWith('-')) {
        formattedAmount = amount.substring(1);
      }
      actualTransactionType = TransactionType.DEPOSIT;
    }
   
    // Создаем транзакцию
    transaction = await this.transactionRepository.createTransaction({
      userId,
      amount: formattedAmount,
      type: actualTransactionType,
    });

    const date: EventTransactionSavedData = {
      userId,
      amount,
      transactionId: transaction.id,
      transactionType: actualTransactionType,
    };

    this.kafkaService.produce({ eventName: EventNameEnum.TransactionSaved, date });
  }

  async createTransferTransaction(params: CreateTransactionDto) : Promise<void> {
    const { userId, amount, transactionType, recipient } = params;

    const transactionWithdraw = await this.transactionRepository.createTransaction({
      userId,
      amount: '-' + amount,
      type: TransactionType.WITHDRAW,
    })

    const dataWithdraw: EventTransactionSavedData = {
      userId,
      amount: '-' + amount,
      transactionId: transactionWithdraw.id,
      transactionType: TransactionType.WITHDRAW,
    }

    this.kafkaService.produce({ eventName: EventNameEnum.TransactionSaved, date: dataWithdraw });

    const transactionDeposit = await this.transactionRepository.createTransaction({
      userId: recipient,
      amount: amount,
      type: TransactionType.DEPOSIT,
    })

    const dataDeposit: EventTransactionSavedData = {
      userId: String(recipient),
      amount,
      transactionId: transactionDeposit.id,
      transactionType: TransactionType.DEPOSIT,
    }

    this.kafkaService.produce({ eventName: EventNameEnum.TransactionSaved, date: dataDeposit });
  }

  async updateStatus(params: EventBalanceChangedData): Promise<void> {
    const { transactionId, status } = params;

    let transactionStatus = TransactionStatus.COMPLETED;
    if (status == BalanceChangedStatus.FAILED) {
      transactionStatus = TransactionStatus.FAILED
    };

    await this.transactionRepository.updateStatus(transactionId, transactionStatus);
  }

  async getTransaction(id: string): Promise<TransactionDto | null> {
    return await this.transactionRepository.findById(id);
  }

  async getTransactions(params: GetTransactionFilterDto): Promise<{
    items: TransactionDto[]; total: number
  }> {
    return await this.transactionRepository.findByParams(params);
  }
    
}

