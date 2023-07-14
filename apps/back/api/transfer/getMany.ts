import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { TransactionType } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
