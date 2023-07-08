import {
  DestinationType, SourceType, TransactionStatus, TransactionType,
} from '@fishprovider/utils/constants/pay';
import type { Transaction } from '@fishprovider/utils/types/Pay.model';

const createDeposit = async (params: {
  payId: string,
  userId: string,

  srcType: SourceType,
  srcId: string,
  srcCurrency: string,
  srcAmount: number,

  srcData?: Record<string, any>,
  srcPayUrl?: string,

  dstId: string,
  dstCurrency: string,
  dstBalance: number,
}) => {
  const {
    payId, userId,
    srcType, srcId, srcCurrency, srcAmount,
    srcData, srcPayUrl,
    dstId, dstCurrency, dstBalance,
  } = params;
  const transaction: Transaction = {
    _id: payId,
    type: TransactionType.deposit,
    status: TransactionStatus.new,
    userId,

    srcType,
    srcId,
    srcCurrency,
    srcAmount,

    srcData,
    srcPayUrl,

    dstType: DestinationType.wallet,
    dstId,
    dstCurrency,
    dstBalanceRequest: dstBalance,

    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await Mongo.collection<Transaction>('transactions').insertOne(transaction);
  return transaction;
};

export default createDeposit;
