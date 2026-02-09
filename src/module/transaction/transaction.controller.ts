/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction-dto.ts';
import { GetTransactionFilterDto } from './dto/get-transaction-filter-dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto): Promise<void> {
    return this.transactionService.create(dto);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<TransactionDto | null> {
    return this.transactionService.getTransaction(id);
  }

  @Get()
  getTransactions(@Query() query: GetTransactionFilterDto): Promise<{ items: TransactionDto[]; total: number }> {
    return this.transactionService.getTransactions(query);  
  }
}

