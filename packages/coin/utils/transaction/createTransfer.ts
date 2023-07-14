import {
  DestinationType, SourceType, TransactionStatus, TransactionType,
} from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';

const createTransfer = async (params: {
  payId: string,
  userId: string,

  srcType: SourceType,
  srcId: string,
  srcCurrency: string,
  srcAmount: number,
  srcBalance: number,

  srcData: Record<string, any>,

  dstId: string,
  dstCurrency: string,
  dstBalance: number,

  dstData: Record<string, any>,
}) => {
  const {
    payId, userId,
    srcType, srcId, srcCurrency, srcAmount, srcBalance,
    srcData,
    dstId, dstCurrency, dstBalance,
    dstData,
  } = params;

  const transaction: Transaction = {
    _id: payId,
    type: TransactionType.transfer,
    status: TransactionStatus.new,
    userId,

    srcType,
    srcId,
    srcCurrency,
    srcAmount,
    srcBalanceRequest: srcBalance,
    srcData,

    dstType: DestinationType.wallet,
    dstId,
    dstCurrency,
    dstBalanceRequest: dstBalance,

    dstData,

    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await Mongo.collection<Transaction>('transactions').insertOne(transaction);
  return transaction;
};

export default createTransfer;
