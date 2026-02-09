import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import * as transactionTypes from './transaction.types';

@Controller()
export class TransactionKafkaController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern(transactionTypes.EventNameEnum.BalanceChanged)
  async handleTransactionsSaved(
    @Payload() message: transactionTypes.EventBalanceChangedData,
  ): Promise<void> {
    await this.transactionService.updateStatus(message);
  }
}
