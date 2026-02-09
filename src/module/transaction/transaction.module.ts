import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { DatabaseModule } from '../database/database.module';
import { TransactionRepository } from './transaction.repository';
import { KafkaModule } from '../../config/kafka/kafka.module';
import { InternalAccountModule } from '../../internal/account.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionKafkaController } from './transaction.kafka,controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    DatabaseModule,
    ConfigModule,
    KafkaModule,
    InternalAccountModule,
  ],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController, TransactionKafkaController],
})
export class TransactionModule {}
