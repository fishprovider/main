import { ErrorType } from '@fishbot/utils/constants/error';
import { TransactionType } from '@fishbot/utils/constants/pay';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import type { User } from '@fishbot/utils/types/User.model';

const withdrawGetMany = async ({ userInfo }: {
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
    type: TransactionType.withdraw,
    userId: uid,
  }).toArray();

  return { result: transactions };
};

export default withdrawGetMany;
