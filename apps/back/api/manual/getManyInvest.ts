import { ErrorType } from '@fishprovider/utils/constants/error';
import { InvestStatus, WalletType } from '@fishprovider/utils/constants/pay';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Wallet } from '@fishprovider/utils/types/Pay.model';
import type { User } from '@fishprovider/utils/types/User.model';

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
