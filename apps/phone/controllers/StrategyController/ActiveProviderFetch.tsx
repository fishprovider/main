import accountGet from '@fishprovider/cross/dist/api/accounts/get';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { useEffect } from 'react';

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
    accountGet({ providerId }).catch(() => {
      storeUser.mergeState({ activeProvider: undefined });
    });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
