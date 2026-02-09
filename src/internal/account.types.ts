import { TransactionType } from 'src/module/transaction/transaction.types';

export type ChangeBalanceParams = {
  userId: string;
  amount: number;
  transactionType: TransactionType;
  transactionId: string;
};
