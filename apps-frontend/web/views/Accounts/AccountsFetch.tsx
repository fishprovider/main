import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import { getAccountsService } from '~services/account/getAccounts.service';

function AccountsFetch() {
  const {
    isServerLoggedIn,
    email,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    email: state.info?.email,
  }));

  useQuery({
    queryFn: () => getAccountsService({ accountViewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsService({ email }),
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return null;
}

export default AccountsFetch;
