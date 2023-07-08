import accountGetManyInfo from '@fishprovider/cross/api/accounts/getManyInfo';
import accountGetManySlim from '@fishprovider/cross/api/accounts/getManySlim';
import accountGetManyUser from '@fishprovider/cross/api/accounts/getManyUser';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';

import { queryKeys } from '~constants/query';

function AccountsFetch() {
  const {
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useQuery({
    queryFn: accountGetManySlim,
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: accountGetManyInfo,
    queryKey: queryKeys.infoAccounts(),
  });
  useQuery({
    queryFn: accountGetManyUser,
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return null;
}

export default AccountsFetch;
