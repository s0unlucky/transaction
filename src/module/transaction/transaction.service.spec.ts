/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { InternalAccountService } from '../../internal/account.service';
import { KafkaService } from '../../config/kafka/kafka.service';
import { EventNameEnum, TransactionType } from './transaction.types';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { mock } from 'jest-mock-extended';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let kafkaService: KafkaService;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            createTransaction: jest.fn(),
          },
        },
        {
          provide: InternalAccountService,
          useValue: mock<InternalAccountService>(),
        },
        {
          provide: KafkaService,
          useValue: {
            produce: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  describe('create', () => {
    it('should create transaction', async () => {
      // Моки для transactionRepository.createTransaction и kafkaService.produce
      const createTransactionDto: CreateTransactionDto = {
        amount: '100',
        userId: 'userId',
        transactionType: TransactionType.DEPOSIT,
      };

      const createdTransaction: TransactionEntity = {
        id: 'id',
        amount: '100',
        userId: 'userId',
        type: TransactionType.DEPOSIT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Моки для методов, которые вызываются в transactionService.create
      jest
        .spyOn(transactionRepository, 'createTransaction')
        .mockResolvedValue(createdTransaction);
      jest.spyOn(kafkaService, 'produce').mockImplementation();

      await transactionService.create(createTransactionDto);

      expect(transactionRepository.createTransaction).toHaveBeenCalledWith({
        userId: createTransactionDto.userId,
        amount: createTransactionDto.amount,
        type: createTransactionDto.transactionType,
      });

      expect(kafkaService.produce).toHaveBeenCalledWith({
        eventName: EventNameEnum.TransactionSaved,
        date: {
          userId: createTransactionDto.userId,
          amount: createTransactionDto.amount,
          transactionId: createdTransaction.id,
          transactionType: createTransactionDto.transactionType,
        },
      });
    });
  });
});
