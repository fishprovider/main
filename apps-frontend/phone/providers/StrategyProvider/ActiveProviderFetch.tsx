import { useEffect } from 'react';

import { getAccountController, watchAccountController } from '~controllers/account.controller';
import { updateUserInfoController } from '~controllers/user.controller';

interface Props {
  providerId: string;
}

function ActiveProviderFetch({ providerId }: Props) {
  const account = watchAccountController((state) => state[providerId]);

  // load from memory on going back
  useEffect(() => {
    updateUserInfoController({ activeAccount: account });
    return () => {
      updateUserInfoController({ activeAccount: undefined });
    };
  }, [account]);

  // load from api on first load
  useEffect(() => {
    getAccountController({ accountId: providerId }).catch((err) => {
      Logger.error(err);
      updateUserInfoController({ activeAccount: undefined });
    });
  }, [providerId]);

  return null;
}

export default ActiveProviderFetch;
