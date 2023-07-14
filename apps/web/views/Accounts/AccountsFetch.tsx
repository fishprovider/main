import accountGetManyInfo from '@fishprovider/cross/dist/api/accounts/getManyInfo';
import accountGetManySlim from '@fishprovider/cross/dist/api/accounts/getManySlim';
import accountGetManyUser from '@fishprovider/cross/dist/api/accounts/getManyUser';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

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
