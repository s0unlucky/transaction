/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { TransactionStatus, TransactionType } from '../transaction.types';
import { Expose } from 'class-transformer';

export class GetTransactionFilterDto {
  @ApiProperty({
    description: 'Индентификатор пользователей',
    type: [String],
  })
  @IsString()
  @IsOptional()
  @Expose()
  Ids: string[];

  @ApiProperty({
    description: 'Индентификатор пользователя',
    type: [String],
  })
  @IsString()
  @IsOptional()
  @Expose()
  userIds: string[];

  @ApiProperty({
    description: 'Сумма', 
    type: [String],
  })
  @IsString()
  @IsOptional()
  @Expose()
  amounts: string[];

  @ApiProperty({
    description: 'Тип транзакции',
    required: false,
    enum: TransactionType,
  })
  @Expose()
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

   @ApiProperty({
    description: 'Статус транзакции',
    required: false,
    enum: TransactionStatus,
  })
  @Expose()
  @IsOptional()
  @IsEnum(TransactionStatus)
  transactionStatus?: TransactionStatus;

  @ApiProperty({
    description: '',
    required: false,
    type: Number,
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiProperty({
    description: '',
    required: false,
    type: Number,
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  skip?: number;
}
