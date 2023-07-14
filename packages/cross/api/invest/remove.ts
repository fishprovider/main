import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeWallets from '~stores/wallets';

const investRemove = async (
  payload: {
    walletId: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Wallet>('/invest/remove', payload, options);
  storeWallets.mergeDoc(doc);
  return doc;
};

export default investRemove;
