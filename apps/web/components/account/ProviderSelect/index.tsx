import accountGetManySlim from '@fishbot/cross/api/accounts/getManySlim';
import accountGetManyUser from '@fishbot/cross/api/accounts/getManyUser';
import { useQuery } from '@fishbot/cross/libs/query';
import storeAccounts from '@fishbot/cross/stores/accounts';
import storeUser from '@fishbot/cross/stores/user';
import _ from 'lodash';
import { useRouter } from 'next/router';

import { queryKeys } from '~constants/query';
import Select from '~ui/core/Select';

function ProviderSelect() {
  const router = useRouter();

  const {
    isServerLoggedIn,
    providerId,
    starProviders = {},
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    providerId: state.activeProvider?._id,
    starProviders: state.info?.starProviders,
  }));
  const accounts = storeAccounts.useStore((state) => _.orderBy(
    _.filter(
      state,
      (account) => account._id === providerId || !!starProviders[account._id],
    ),
    [
      (account) => account.order || 0,
      (account) => account.name,
    ],
    ['desc', 'asc'],
  ));

  useQuery({
    queryFn: accountGetManySlim,
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: accountGetManyUser,
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return (
    <Select
      value={providerId}
      onChange={(value) => {
        if (!value) return;
        router.push({
          pathname: router.pathname,
          query: {
            providerId: value,
          },
        });
      }}
      data={accounts.map(({ _id, name, icon = '' }) => ({
        value: _id,
        label: `${name} ${icon}`,
      }))}
      // searchable
    />
  );
}

export default ProviderSelect;
