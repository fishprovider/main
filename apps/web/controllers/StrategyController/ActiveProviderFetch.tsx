import accountGet from '@fishprovider/cross/dist/api/accounts/get';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { getAccountService } from '@fishprovider/services';
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
      Logger.error(err);
      storeUser.mergeState({ activeProvider: undefined });
      toastError(err.message);
    });
    getAccountService({
      filter: {
        accountId: providerId,
      },
      options: {},
      repositories: {
        account: FishApiAccountRepository,
      },
    }).catch((err) => {
      Logger.error(err);
      // storeUser.mergeState({ activeProvider: undefined });
      // toastError(err.message);
    });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
