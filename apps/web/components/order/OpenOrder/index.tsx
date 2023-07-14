import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import { useEffect } from 'react';

import SymbolsSelect from '~components/price/SymbolsSelect';
import { sessionRead } from '~libs/cache';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import AccountActivities from './AccountActivities';
import OrderModal from './OrderModal';
import TodayOrders from './TodayOrders';

function OpenOrder() {
  const {
    activities = {},
    members = [],
    roles,
    providerId,
  } = storeUser.useStore((state) => ({
    activities: state.activeProvider?.activities,
    members: state.activeProvider?.members,
    providerId: state.activeProvider?._id,
    roles: state.info?.roles,
  }));

  useEffect(() => {
    sessionRead<OrderWithoutId>('orderLast').then((orderLast) => {
      if (orderLast) {
        storeUser.mergeState({ activeSymbol: orderLast.symbol });
      }
    });
  }, []);

  const { isTraderProvider } = getRoleProvider(roles, providerId);

  const onEdit = async () => {
    openModal({
      title: <Title size="h4">Open Order</Title>,
      content: <OrderModal />,
    });
  };

  return (
    <>
      <SymbolsSelect />
      <Group>
        {isTraderProvider && (
          <Button onClick={onEdit} rightIcon={<Icon name="Add" />}>
            New Order
          </Button>
        )}
        <TodayOrders />
        <AccountActivities activities={activities} members={members} />
      </Group>
    </>
  );
}

export default OpenOrder;
