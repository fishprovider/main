import { getAccountController } from '@fishprovider/adapter-frontend';
import { getAccountUseCase } from '@fishprovider/application-rules';
import accountGet from '@fishprovider/cross/dist/api/accounts/get';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { FishApiAccountRepository } from '@fishprovider/framework-fish-api';
import { useEffect } from 'react';

import { toastError } from '~ui/toast';

const getAccount = getAccountController(getAccountUseCase(FishApiAccountRepository));

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

    getAccount({ accountId: providerId });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
