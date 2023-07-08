import type { Wallet } from '@fishprovider/utils/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeWallets from '~stores/wallets';

const investAdd = async (
  payload: {
    amount: number,
    providerId: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Wallet>('/invest/add', payload, options);
  storeWallets.mergeDoc(doc);
  return doc;
};

export default investAdd;
