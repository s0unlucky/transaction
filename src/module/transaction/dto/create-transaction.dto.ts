/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TransactionType } from '../transaction.types';
import { Expose } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Индентификатор пользователя',
    type: String,
  })
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Сумма в копейках',
    type: String,
  })
  @IsString()
  @Expose()
  amount: string;

  @ApiProperty({
    description: 'Тип транзакции',
    required: false,
    enum: TransactionType,
  })
  @Expose()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @ApiProperty({
    description: 'Идентификатор получателя, если это перевод средств',
    type: String,
  })
  @IsString()
  @Expose()
  @IsOptional()
  recipient?: string;
}
