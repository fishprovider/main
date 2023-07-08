import accountGet from '@fishprovider/cross/api/accounts/get';
import storeAccounts from '@fishprovider/cross/stores/accounts';
import storeUser from '@fishprovider/cross/stores/user';
import { useEffect } from 'react';

import { toastError } from '~ui/toast';

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
    accountGet({ providerId }).catch((err) => {
      storeUser.mergeState({ activeProvider: undefined });
      toastError(err.message);
    });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
