import { ErrorType } from '@fishbot/utils/constants/error';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import type { User } from '@fishbot/utils/types/User.model';

const transferGet = async ({ data, userInfo }: {
  data: {
    payId: string,
  }
  userInfo: User,
}) => {
  const { payId } = data;
  if (!payId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    _id: payId,
    userId: uid,
  });
  if (!transaction) {
    return { error: ErrorType.transactionNotFound };
  }

  return { result: transaction };
};

export default transferGet;
