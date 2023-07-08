import { ErrorType } from '@fishprovider/utils/constants/error';
import { TransactionType } from '@fishprovider/utils/constants/pay';
import type { Transaction } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const transferGetMany = async ({ userInfo }: {
  data: {
    page?: number,
    pageSize?: number,
  }
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const transactions = await Mongo.collection<Transaction>('transactions').find({
    type: TransactionType.transfer,
    userId: uid,
  }).toArray();

  return { result: transactions };
};

export default transferGetMany;
