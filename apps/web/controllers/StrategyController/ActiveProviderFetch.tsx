import accountGet from '@fishbot/cross/api/accounts/get';
import storeAccounts from '@fishbot/cross/stores/accounts';
import storeUser from '@fishbot/cross/stores/user';
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
