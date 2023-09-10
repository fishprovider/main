import updateTransaction from '@fishprovider/coin/dist/utils/transaction/updateTransaction';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { DestinationPayType, TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const transferWithdraw = async ({ data, userInfo }: {
  data: {
    payId: string,
    dstPayId: string,
  }
  userInfo: User,
}) => {
  const { payId, dstPayId } = data;
  if (!payId || !dstPayId) {
    return { error: ErrorType.badRequest };
  }

  const { uid, roles } = userInfo;
  const { isManagerWeb } = getRoleProvider(roles);
  if (!isManagerWeb) {
    return { error: ErrorType.accessDenied };
  }

  const transaction = await Mongo.collection<Transaction>('transactions').findOne({
    _id: payId,
    'manualData.userId': uid,
    status: TransactionStatus.pending,
    dstPayType: DestinationPayType.manual,
  });
  if (!transaction?.manualData) {
    return { error: ErrorType.transactionNotFound };
  }

  const updateData: Partial<Transaction> = {
    dstPayId,
    dstAmount: transaction.srcAmount,
    manualData: {
      ...transaction.manualData,
      description: 'Send withdraw',
      endedAt: new Date(),
    },
  };
  await updateTransaction({
    transaction,
    updateData,
    unsetFields: ['statusRequest'],
  });

  return { result: { ...transaction, ...updateData } };
};

export default transferWithdraw;
