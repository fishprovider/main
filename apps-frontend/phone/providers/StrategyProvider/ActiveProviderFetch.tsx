import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { getAccountService } from '~services/account/getAccount.service';

interface Props {
  providerId: string;
}

function ActiveProviderFetch({ providerId }: Props) {
  const account = storeAccounts.useStore((state) => state[providerId]);

  // load from memory on going back
  useEffect(() => {
    storeUser.mergeState({ activeProvider: account });
    return () => {
      storeUser.mergeState({ activeProvider: undefined });
    };
  }, [account]);

  // load from api on first load
  useEffect(() => {
    getAccountService({ accountId: providerId }).catch((err) => {
      Logger.error(err);
      storeUser.mergeState({ activeProvider: undefined });
    });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
