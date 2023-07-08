import type { Wallet } from '@fishprovider/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeWallets from '~stores/wallets';

const walletAdd = async (
  payload: {
    name: string,
    currency: string,
    address: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Wallet>('/wallet/add', payload, options);
  storeWallets.mergeDoc(doc);
  return doc;
};

export default walletAdd;
