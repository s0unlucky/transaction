export enum TransactionType {
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
}

export type FindTransactionParams = {
  userIds?: string[];
  ids?: string[];
  type?: TransactionType;
  amounts?: string[];
  status?: TransactionStatus;
  take?: number;
  skip?: number;
};

export enum TransactionStatus {
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum BalanceChangedStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type EventTransactionSavedData = {
  userId: string;
  amount: string;
  transactionId: string;
  transactionType: TransactionType;
};

export type EventBalanceChangedData = {
  transactionId: string;
  status: BalanceChangedStatus;
};

export enum EventNameEnum {
  TransactionSaved = 'TransactionSaved',
  BalanceChanged = 'BalanceChanged',
}
