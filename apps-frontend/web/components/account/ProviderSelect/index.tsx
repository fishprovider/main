import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import _ from 'lodash';
import { useRouter } from 'next/router';

import { getAccountsController, watchAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
import Select from '~ui/core/Select';

function ProviderSelect() {
  const router = useRouter();

  const {
    isServerLoggedIn,
    providerId,
    starAccounts = {},
  } = watchUserInfoController((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    providerId: state.activeAccount?._id,
    starAccounts: state.activeUser?.starAccounts,
  }));
  const accounts = watchAccountController((state) => _.orderBy(
    _.filter(
      state,
      (account) => account._id === providerId || !!starAccounts[account._id],
    ),
    [
      (account) => account.order || 0,
      (account) => account.name,
    ],
    ['desc', 'asc'],
  ));

  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.private }),
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  const options = accounts.map(({ _id, name, icon = '' }) => ({
    value: _id,
    label: `${name} ${icon}`,
  }));

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
      data={options}
      // searchable
    />
  );
}

export default ProviderSelect;
