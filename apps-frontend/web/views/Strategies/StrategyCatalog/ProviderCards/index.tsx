import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useState } from 'react';

import { CardVariant } from '~constants/account';
import Flex from '~ui/core/Flex';
import Group from '~ui/core/Group';
import Pagination from '~ui/core/Pagination';
import Select from '~ui/core/Select';

import ProviderCard from './ProviderCard';

const pageSizeOptions = ['5', '10', '20', '50', '100'];
const pageSizeDefault = 10;

interface Props {
  favorite?: boolean,
  search?: string,
  variant?: CardVariant,
}

function ProviderCards({
  favorite,
  search,
  variant = CardVariant.default,
}: Props) {
  const {
    starProviders = {},
  } = storeUser.useStore((state) => ({
    starProviders: state.info?.starProviders,
  }));

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const providerIds = storeAccounts.useStore((state) => _.orderBy(
    _.filter(state, (account) => {
      if (!account.strategyId) return false;
      if (account.providerGroupId && account.providerGroupId !== account._id) return false;
      if (favorite && !starProviders[account._id]) return false;
      if (search && !account.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [
      (account) => account.order || 0,
      (account) => account.name,
    ],
    ['desc', 'asc'],
  )
    .slice((page - 1) * pageSize, page * pageSize)
    .map((account) => account._id));

  return (
    <>
      <Flex justify="center" wrap="wrap" gap="md" py="xl">
        {providerIds.map((providerId) => (
          <ProviderCard
            key={providerId}
            providerId={providerId}
            variant={variant}
          />
        ))}
      </Flex>
      <Group position="center">
        <Pagination
          total={page + (providerIds.length < pageSize ? 0 : 1)}
          value={page}
          onChange={(value) => setPage(value)}
          size="lg"
        />
        <Select
          data={pageSizeOptions}
          value={String(pageSize)}
          onChange={(value) => {
            if (!value) return;
            setPageSize(+value);
          }}
          w={80}
        />
      </Group>
    </>
  );
}

export default ProviderCards;
