import updateTransaction from '@fishbot/coin/utils/transaction/updateTransaction';
import { ErrorType } from '@fishbot/utils/constants/error';
import { DestinationPayType, TransactionStatus } from '@fishbot/utils/constants/pay';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import type { User } from '@fishbot/utils/types/User.model';

const assignWithdraw = async ({ data, userInfo }: {
  data: {
    payId: string,
  }
  userInfo: User,
}) => {
  const { payId } = data;
  if (!payId) {
    return { error: ErrorType.badRequest };
  }

  const { uid, roles } = userInfo;
  const { isManagerWeb } = getRoleProvider(roles);
  if (!isManagerWeb) {
    return { error: ErrorType.accessDenied };
  }

  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    _id: payId,
    'manualData.userId': { $exists: false },
  });
  if (!transaction) {
    return { error: ErrorType.transactionNotFound };
  }

  const updateData: Partial<Transaction> = {
    status: TransactionStatus.pending,
    dstPayType: DestinationPayType.manual,
    manualData: {
      userId: uid,
      description: 'Assign withdraw',
      startedAt: new Date(),
    },
  };
  await updateTransaction({
    transaction,
    updateData,
  });

  return { result: { ...transaction, ...updateData } };
};

export default assignWithdraw;
