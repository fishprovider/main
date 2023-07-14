import { TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import _ from 'lodash';

import { getTransaction } from '~libs/coinbaseApi';

// TODO: coinbase parse response
const transformSendTransaction = (res: any) => {
  const todo = {
    dstData: res,
    status: TransactionStatus.pending,
    dstAmount: 0,
  };
  return todo;
};

const getTransactionUpdates = async (accountId: string, transactionId: string) => {
  const res = await getTransaction(accountId, transactionId);
  return transformSendTransaction(res);
};

export {
  getTransactionUpdates,
};
