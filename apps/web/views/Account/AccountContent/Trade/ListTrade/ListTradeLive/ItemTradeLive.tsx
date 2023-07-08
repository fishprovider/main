import storeUser from '@fishprovider/cross/stores/user';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Order } from '@fishprovider/utils/types/Order.model';
import type { Price } from '@fishprovider/utils/types/Price.model';

import OrderActivities from '~components/order/OrderActivities';
import OrderInfo from '~components/order/OrderInfo';
import OrderSettings from '~components/order/OrderSettings';
import Profit from '~components/order/Profit';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Menu from '~ui/core/Menu';
import Table from '~ui/core/Table';

import AverageOrder from './AverageOrder';
import CloseOrder from './CloseOrder';
import HideOrder from './HideOrder';
import LockOrder from './LockOrder';
import LockSL from './LockSL';
import RebornOrder from './RebornOrder';

interface Props {
  order: Order;
  prices: Record<string, Price>;
  mergedView: boolean;
  unmergeView: () => void;
}

function ItemTradeLive({
  order, prices, mergedView, unmergeView,
}: Props) {
  const {
    providerId = '',
    roles,
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    roles: state.info?.roles,
  }));
  const { isTraderProvider, isProtectorProvider } = getRoleProvider(roles, providerId);

  const renderProfit = () => (
    <>
      <Profit order={order} prices={prices} />
      {mergedView ? null : <LockSL order={order} prices={prices} />}
    </>
  );

  const renderActions = () => {
    if (mergedView) {
      return (
        <Icon
          name="Merge"
          size="small"
          button
          color="teal"
          buttonProps={{
            style: {
              transform: 'rotate(90deg)',
            },
          }}
          tooltip="Aggregated Order"
          onClick={unmergeView}
        />
      );
    }

    if (order.lock) {
      return <Icon name="Lock" size="small" disabled tooltip="Locked" />;
    }

    const menuItems = [
      {
        key: 'average',
        content: <AverageOrder order={order} />,
      },
      {
        key: 'lock',
        content: <LockOrder order={order} />,
      },
      {
        key: 'hide',
        content: <HideOrder order={order} />,
      },
      {
        key: 'reborn',
        content: <RebornOrder order={order} />,
      },
    ];

    return (
      <Group spacing={0}>
        {isTraderProvider && <OrderSettings order={order} />}
        <CloseOrder order={order} />
        {isTraderProvider && (
          <Menu items={menuItems}>
            <span>
              <Icon name="MoreHoriz" button />
            </span>
          </Menu>
        )}
      </Group>
    );
  };

  return (
    <Table.Row>
      <Table.Cell><OrderInfo order={order} mergedView={mergedView} /></Table.Cell>
      {mergedView ? null : <Table.Cell><OrderActivities order={order} /></Table.Cell>}
      <Table.Cell>{renderProfit()}</Table.Cell>
      {(isTraderProvider || isProtectorProvider) && <Table.Cell>{renderActions()}</Table.Cell>}
    </Table.Row>
  );
}

export default ItemTradeLive;
