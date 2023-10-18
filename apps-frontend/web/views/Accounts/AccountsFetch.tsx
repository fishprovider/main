import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import { getAccountsController } from '~controller-services/account/getAccounts.controller';

function AccountsFetch() {
  const {
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useQuery({
    queryFn: () => getAccountsController({ accountViewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsController({}),
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return null;
}

export default AccountsFetch;
