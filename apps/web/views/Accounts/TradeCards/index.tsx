import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import priceGetNames from '@fishprovider/cross/dist/api/prices/getNames';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { ProviderTradeType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { Roles } from '@fishprovider/utils/dist/constants/user';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import Group from '~ui/core/Group';
import Pagination from '~ui/core/Pagination';
import Select from '~ui/core/Select';
import { refreshMS } from '~utils';

import TradeCard from './TradeCard';
import TradeCardNew from './TradeCardNew';

const pageSizeOptions = ['5', '10', '20', '50', '100'];
const pageSizeDefault = 10;

const usePriceOrders = (allOrders: Order[]) => {
  const ordersByProviderType = _.groupBy(allOrders, (order) => order.providerType);
  const providerTypes = Object.keys(ordersByProviderType) as ProviderType[];
  const providerTypeSymbols = providerTypes.map((providerType) => {
    const symbols = _.sortBy(_.uniq([
      ...getMajorPairs(providerType),
      ..._.map(ordersByProviderType[providerType], (order) => order.symbol),
    ]));
    return { providerType, symbols };
  });

  useQuery({
    queryFn: () => Promise.all(providerTypeSymbols.map((item) => priceGetMany(item))),
    queryKey: queryKeys.prices(),
    refetchInterval: refreshMS,
  });

  useEffect(() => {
    Promise.all(providerTypeSymbols.map((item) => priceGetNames(item)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerTypeSymbols.length]);

  useEffect(() => {
    Promise.all(providerTypeSymbols.map((item) => priceGetMany({ ...item, reload: true })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrders.length, providerTypeSymbols.length]);
};

interface Props {
  providerTradeType: ProviderTradeType,
  favorite?: boolean,
  search?: string,
  filterBy?: string[],
  sortBy?: string,
}

function TradeCards({
  providerTradeType,
  favorite,
  search,
  filterBy = [],
  sortBy,
}: Props) {
  const {
    userId = '',
    starProviders = {},
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    starProviders: state.info?.starProviders,
  }));

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  useEffect(() => {
    setPage(1);
  }, [favorite, search, filterBy, sortBy]);

  const sortByLastView = (account: Account) => {
    const activity = account.activities?.[userId];
    if (!activity) return 0;
    return new Date(activity.lastView).getTime();
  };

  const sortByLastActive = (account: Account) => _.last(
    _.sortBy(
      _.map(account.activities, (item) => new Date(item.lastView).getTime()),
    ),
  );

  const sortByRole = (account: Account) => {
    const role = account.members?.find((item) => item.userId === userId)?.role;
    if (role === Roles.admin) return 0;
    if (role === Roles.trader) return 1;
    if (role === Roles.protector) return 2;
    if (role === Roles.viewer) return 3;
    return 4;
  };

  const getSortOptions = () => {
    if (sortBy === 'name') {
      return {
        funcs: ['name'],
        sides: ['asc'],
      };
    }
    if (sortBy === 'role') {
      return {
        funcs: [sortByRole, 'name'],
        sides: ['asc', 'asc'],
      };
    }
    if (sortBy === 'lastActive') {
      return {
        funcs: [sortByLastActive, 'name'],
        sides: ['desc', 'asc'],
      };
    }
    return {
      funcs: [sortByLastView, 'name'],
      sides: ['desc', 'asc'],
    };
  };

  const accounts = storeAccounts.useStore((state) => {
    const filteredAccounts = _.filter(state, (account) => {
      if (account.providerTradeType !== providerTradeType) return false;

      if (favorite && !starProviders[account._id]) return false;

      if (search && !account.name.toLowerCase().includes(search.toLowerCase())) return false;

      if (filterBy.some((item) => item === 'locked') && !(account.locks && account.locks.length > 0)) return false;
      if (filterBy.some((item) => item === 'nolock') && !!account.locks?.length) return false;

      return !!account.members?.some((member) => {
        if (member.userId !== userId) return false;

        const filterByRole = filterBy.filter((item) => item.startsWith('role-'));
        if (filterByRole.length && !filterByRole.some((item) => item.replace('role-', '') === member.role)) return false;

        return true;
      });
    });

    const sortOptions = getSortOptions();
    const sortedAccounts = _.orderBy(
      filteredAccounts,
      sortOptions.funcs,
      sortOptions.sides as ('asc' | 'desc')[],
    ) as Account[];

    const pageAccounts = sortedAccounts.slice((page - 1) * pageSize, page * pageSize);
    return pageAccounts;
  });

  const accountIds = accounts.map((account) => account._id);

  const orders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => accountIds.includes(item.providerId)
      && [OrderStatus.live, OrderStatus.pending].includes(item.status),
  ));

  usePriceOrders(orders);

  return (
    <>
      {accounts.map((item) => <TradeCard key={item._id} providerId={item._id} />)}
      <TradeCardNew />
      <Group position="center">
        <Pagination
          total={page + (accounts.length < pageSize ? 0 : 1)}
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

export default TradeCards;
