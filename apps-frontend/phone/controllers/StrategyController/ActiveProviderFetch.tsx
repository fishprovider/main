import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

import { getAccountController } from '~controller-services/account/getAccount.controller';

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
    getAccountController({ accountId: providerId }).catch((err) => {
      Logger.error(err);
      storeUser.mergeState({ activeProvider: undefined });
    });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
