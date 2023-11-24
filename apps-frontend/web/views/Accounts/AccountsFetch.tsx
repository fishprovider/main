import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';

import { getAccountsController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';

function AccountsFetch() {
  const {
    isServerLoggedIn,
    email,
  } = watchUserInfoController((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    email: state.activeUser?.email,
  }));

  useQuery({
    queryFn: () => getAccountsController({ accountViewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsController({ email }),
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return null;
}

export default AccountsFetch;
