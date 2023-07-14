import type { WalletType } from '@fishprovider/utils/dist/constants/pay';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeWallets from '~stores/wallets';

const walletGetMany = async (
  payload: {
    type?: WalletType,
  },
  options?: ApiConfig,
) => {
  const docs = await apiPost<Wallet[]>('/wallet/getMany', payload, options);
  storeWallets.mergeDocs(docs);
  return docs;
};

export default walletGetMany;
