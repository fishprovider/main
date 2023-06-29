import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountRemove = async (
  payload: {
    providerId: string;
  },
  options?: ApiConfig,
) => {
  const docId = await apiPost<string>('/accounts/remove', payload, options);
  storeAccounts.removeDoc(docId);
  return docId;
};

export default accountRemove;
