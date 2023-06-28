import { InvestStatus, WalletType } from '@fishbot/utils/constants/pay';
import type { InvestData, Wallet } from '@fishbot/utils/types/Pay.model';

const createInvest = async (params: {
  userId: string,
  userEmail: string,
  userName: string,
  walletId: string,
  name: string,
  currency: string,
  investStatus: InvestStatus,
  investData: InvestData,
}) => {
  const {
    userId, userEmail, userName, walletId, name, currency,
    investStatus, investData,
  } = params;
  const wallet = {
    _id: walletId,
    type: WalletType.invest,

    userId,
    userEmail,
    userName,

    name,
    currency,
    balance: 0,

    investStatus,
    investData,

    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await Mongo.collection<Wallet>('wallets').insertOne(wallet);
  return wallet;
};

export default createInvest;
