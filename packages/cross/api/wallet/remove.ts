import { ApiConfig, apiPost } from '~libs/api';
import storeWallets from '~stores/wallets';

const walletRemove = async (
  payload: {
    walletId: string,
  },
  options?: ApiConfig,
) => {
  await apiPost('/wallet/remove', payload, options);
  storeWallets.removeDoc(payload.walletId);
};

export default walletRemove;
