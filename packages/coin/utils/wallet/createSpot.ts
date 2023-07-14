import { WalletType } from '@fishprovider/utils/dist/constants/pay';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';

const createSpot = async (params: {
  userId: string,
  userEmail: string,
  userName: string,
  walletId: string
  currency: string,
}) => {
  const {
    userId, userEmail, userName, walletId, currency,
  } = params;
  const wallet = {
    _id: walletId,
    type: WalletType.spot,

    userId,
    userEmail,
    userName,

    name: `${currency} Wallet`,
    currency,
    balance: 0,

    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await Mongo.collection<Wallet>('wallets').insertOne(wallet);
  return wallet;
};

export default createSpot;
