import orderGetHistory from '@fishprovider/cross/dist/api/orders/getHistory';
import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useMutate, useQuery } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfitIcon } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import ProfitColor from '~components/price/ProfitColor';
import { activityFields } from '~constants/account';
import useToggle from '~hooks/useToggle';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Pagination from '~ui/core/Pagination';
import RangeSlider from '~ui/core/RangeSlider';
import Stack from '~ui/core/Stack';
import Switch from '~ui/core/Switch';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';

import ItemHistory from './ItemHistory';

function History() {
  const {
    providerId = '',
    providerType = ProviderType.icmarkets,
    asset = 'USD',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    providerType: state.activeProvider?.providerType,
    asset: state.activeProvider?.asset,
  }));
  const deals = storeOrders.useStore((state) => (
    _.filter(
      state,
      (order) => order.providerId === providerId
        && order.status === OrderStatus.closed,
    )
  ));

  const [page, setPage] = useState(1);
  const [rowRange, setRowRange] = useState<[number, number]>([0, 20]);
  const [showAllCols, toggleShowAllCols] = useToggle(false);

  const orders = _.orderBy(deals, ['createdAt'], ['desc'])
    .slice(rowRange[0], rowRange[1]);
  const symbols = _.sortBy(_.uniq([
    ...getMajorPairs(providerType),
    ...orders.map((order) => order.symbol),
  ]));

  useEffect(() => {
    orderGetHistory({ providerId, weeks: 1, reload: true });
  }, [providerId]);

  useQuery({
    queryFn: () => priceGetMany({ providerType, symbols, reload: true }),
    queryKey: queryKeys.prices(providerType, ...symbols),
    enabled: !!symbols.length,
  });

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetHistory,
  });

  const onReload = () => {
    reload({
      providerId,
      weeks: page,
      reload: true,
    }, {
      onSuccess: (dealsArr) => {
        const orderIds = dealsArr.map((item) => item._id);
        if (!orderIds.length) return;
        orderGetManyInfo({ providerId, orderIds, fields: activityFields });
      },
    });
  };

  let totalChats = 0;
  let totalGrossProfit = 0;
  let totalFee = 0;
  _.forEach(orders, (order) => {
    totalChats += _.size(order.chats); // + _.size(order.comments);
    totalGrossProfit += order.grossProfit || 0;
    totalFee += (order.commissionClose || 0) + (order.commission || 0) + (order.swap || 0);
  });
  const endBalance = _.head(orders)?.balance || 0;
  const startBalance = _.last(orders)?.balance || 0;
  const totalBalanceDelta = _.round(endBalance - startBalance, 2);
  const totalBalanceDeltaRatio = startBalance && (totalBalanceDelta * 100) / startBalance;
  const totalBalanceDeltaIcon = getProfitIcon(totalBalanceDeltaRatio);

  const renderPagination = (textPosition: string) => (
    <Group>
      {textPosition === 'top' && (
        <Text>
          {`Last ${page > 1 ? page : ''} week${page > 1 ? 's' : ''} `}
        </Text>
      )}
      <Pagination
        total={page + 1}
        value={page}
        onChange={(value) => {
          setPage(value);
          onReload();
        }}
      />
      {textPosition === 'bottom' && (
        <Text>
          {`Last ${page > 1 ? page : ''} week${page > 1 ? 's' : ''} `}
        </Text>
      )}
    </Group>
  );

  const renderRowTotal = () => (
    <Table.Row>
      <Table.Cell>{`${orders.length} orders (${symbols.length} pairs)`}</Table.Cell>
      <Table.Cell>{`${totalChats} chats`}</Table.Cell>
      {showAllCols && (
        <>
          <Table.Cell>
            <ProfitColor profit={totalGrossProfit}>{_.round(totalGrossProfit, 2)}</ProfitColor>
          </Table.Cell>
          <Table.Cell>{_.round(totalFee, 2)}</Table.Cell>
        </>
      )}
      <Table.Cell>
        <ProfitColor profit={totalGrossProfit + totalFee}>
          {_.round(totalGrossProfit + totalFee, 2)}
        </ProfitColor>
      </Table.Cell>
      <Table.Cell>
        <ProfitColor profit={totalBalanceDelta}>
          {`${totalBalanceDelta > 0 ? '+' : ''}${totalBalanceDelta} (${_.round(totalBalanceDeltaRatio, 2)}% ${totalBalanceDeltaIcon})`}
        </ProfitColor>
      </Table.Cell>
    </Table.Row>
  );

  const renderBody = () => (
    <>
      {renderRowTotal()}
      {orders.map((order) => (
        <ItemHistory key={order._id} order={order} showAllCols={showAllCols} />
      ))}
    </>
  );

  return (
    <Stack>
      <Group>
        {renderPagination('top')}
        <Icon name="Sync" size="small" button onClick={onReload} loading={isLoadingReload} />
      </Group>
      <Switch
        label="Show All Columns"
        checked={showAllCols}
        onChange={() => toggleShowAllCols()}
      />
      <RangeSlider
        value={rowRange}
        onChange={setRowRange}
        min={0}
        max={deals.length}
      />
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>Order</Table.Header>
            <Table.Header>Activity</Table.Header>
            {showAllCols && (
              <>
                <Table.Header>{`Gross Profit (${asset})`}</Table.Header>
                <Table.Header>{`Fee (${asset})`}</Table.Header>
              </>
            )}
            <Table.Header>{`Profit (${asset})`}</Table.Header>
            <Table.Header>{`Balance (${asset})`}</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {renderBody()}
        </Table.TBody>
      </Table>
      {renderPagination('bottom')}
    </Stack>
  );
}

export default History;
