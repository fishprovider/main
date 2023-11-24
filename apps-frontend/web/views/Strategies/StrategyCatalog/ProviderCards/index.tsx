import _ from 'lodash';
import { useState } from 'react';

import { CardVariant } from '~constants/account';
import { watchAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
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
  category?: string,
}

function ProviderCards({
  favorite,
  search,
  variant = CardVariant.default,
  category,
}: Props) {
  const {
    starProviders = {},
  } = watchUserInfoController((state) => ({
    starProviders: state.activeUser?.starAccounts,
  }));

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const pageProviderIds = watchAccountController((state) => _.orderBy(
    _.filter(state, (account) => {
      if (!account.strategyId) return false;
      if (account.groupId && account.groupId !== account._id) return false;
      if (favorite && !starProviders[account._id]) return false;
      if (search && !account.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && !(account.category === category || account.categories?.includes(category)
      )) return false;
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

  const providerIds = pageProviderIds.length ? pageProviderIds : ['loading-1', 'loading-2'];

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
      {providerIds.length > 10 && (
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
      )}
    </>
  );
}

export default ProviderCards;
