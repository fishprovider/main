import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useRouter } from 'next/router';

import { getAccountsService } from '~services/account/getAccounts.service';
import Select from '~ui/core/Select';

function ProviderSelect() {
  const router = useRouter();

  const {
    isServerLoggedIn,
    providerId,
    email,
    starProviders = {},
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    providerId: state.activeProvider?._id,
    email: state.info?.email,
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
    queryFn: () => getAccountsService({ accountViewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsService({ email }),
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
