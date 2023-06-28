import { ErrorType } from '@fishbot/utils/constants/error';
import { InvestStatus, WalletType } from '@fishbot/utils/constants/pay';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Wallet } from '@fishbot/utils/types/Pay.model';
import type { User } from '@fishbot/utils/types/User.model';

const doneStatuses = [
  InvestStatus.active,
  InvestStatus.inactive,
];

const manualGetManyInvest = async ({ userInfo }: {
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

  const wallets = await Mongo.collection<Wallet>('wallets').find({
    type: WalletType.invest,
    investStatus: { $nin: doneStatuses },
    $or: [
      {
        'manualData.userId': { $exists: false },
      },
      {
        'manualData.userId': uid,
      },
    ],
  }).toArray();

  return { result: wallets };
};

export default manualGetManyInvest;
