import updateTransaction from '@fishprovider/coin/dist/utils/transaction/updateTransaction';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { DestinationPayType, TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

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
