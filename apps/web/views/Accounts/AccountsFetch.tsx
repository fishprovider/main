import accountGetManyInfo from '@fishbot/cross/api/accounts/getManyInfo';
import accountGetManySlim from '@fishbot/cross/api/accounts/getManySlim';
import accountGetManyUser from '@fishbot/cross/api/accounts/getManyUser';
import { useQuery } from '@fishbot/cross/libs/query';
import storeUser from '@fishbot/cross/stores/user';

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
