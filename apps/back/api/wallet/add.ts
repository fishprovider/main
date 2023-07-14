import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { WalletType } from '@fishprovider/utils/dist/constants/pay';
import randomId from '@fishprovider/utils/dist/helpers/random';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const walletAdd = async ({ data, userInfo }: {
  data: {
    name: string,
    currency: string,
    address: string,
  }
  userInfo: User,
}) => {
  const { name, currency, address } = data;
  const { uid, email, name: userName } = userInfo;
  if (!uid || !name || !currency || !address) {
    return { error: ErrorType.badRequest };
  }

  const walletId = `${uid}-${currency}-${randomId()}`;
  const newWallet: Wallet = {
    _id: walletId,
    type: WalletType.external,

    userId: uid,
    userEmail: email,
    userName,

    name,
    currency,
    balance: 0,

    address,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await Mongo.collection<Wallet>('wallets').insertOne(newWallet);

  return { result: newWallet };
};

export default walletAdd;
