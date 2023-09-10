import accountGetManySlim from '@fishprovider/cross/dist/api/accounts/getManySlim';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import _ from 'lodash';
import { useState } from 'react';

import ProviderCards from '~components/ProviderCards';
import ScrollView from '~ui/ScrollView';
import Stack from '~ui/Stack';
import { refreshMS } from '~utils';

// const pageSizeOptions = ['5', '10', '20', '50', '100'];
const pageSizeDefault = 10;

export default function Strategies() {
  const [page, _setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(pageSizeDefault);

  const providerIds = storeAccounts.useStore((state) => _.orderBy(
    _.filter(state, (account) => {
      if (!account.strategyId) return false;
      if (account.providerGroupId && account.providerGroupId !== account._id) return false;
      // if (favorite && !starProviders[account._id]) return false;
      // if (search && !account.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [
      (account) => account.order || 0,
      (account) => account.name,
    ],
    ['desc', 'asc'],
  ).slice((page - 1) * pageSize, page * pageSize)
    .map((account) => account._id));

  useQuery({
    queryFn: accountGetManySlim,
    queryKey: queryKeys.slimAccounts(),
    refetchInterval: refreshMS,
  });

  return (
    <ScrollView>
      <Stack>
        <ProviderCards providerIds={providerIds} />
      </Stack>
    </ScrollView>
  );
}
