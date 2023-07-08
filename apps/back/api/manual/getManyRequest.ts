import { ErrorType } from '@fishprovider/utils/constants/error';
import { TransactionStatus, TransactionType } from '@fishprovider/utils/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Transaction } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

const doneStatuses = [
  TransactionStatus.cancelled,
  TransactionStatus.expired,
  TransactionStatus.success,
  TransactionStatus.failed,
];

const unsuccessStatuses = [
  TransactionStatus.cancelled,
  TransactionStatus.expired,
  TransactionStatus.failed,
];

const errorStatuses = [
  TransactionStatus.expired,
  TransactionStatus.failed,
];

const manualGetManyRequest = async ({ userInfo }: {
  data: {
    page?: number,
    pageSize?: number,
  }
  userInfo: User,
}) => {
  const { uid, roles } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const { isManagerWeb } = getRoleProvider(roles);
  if (!isManagerWeb) {
    return { error: ErrorType.accessDenied };
  }

  const transactions = await Mongo.collection<Transaction>('transactions').find({
    $or: [
      {
        type: TransactionType.withdraw,
        status: { $nin: doneStatuses },
        statusRequest: { $exists: true },
      },
      {
        type: TransactionType.transfer,
        status: { $in: unsuccessStatuses },
      },
      {
        type: TransactionType.deposit,
        status: { $in: errorStatuses },
      },
    ],
  }).toArray();

  return { result: transactions };
};

export default manualGetManyRequest;
