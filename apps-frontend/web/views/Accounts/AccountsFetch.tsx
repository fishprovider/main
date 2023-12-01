import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';

import { getAccountsController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';

function AccountsFetch() {
  const {
    isServerLoggedIn,
  } = watchUserInfoController((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.private }),
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return null;
}

export default AccountsFetch;
