import { getRoleProvider } from '@fishprovider/core';
import type { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import { useEffect } from 'react';

import SymbolsSelect from '~components/price/SymbolsSelect';
import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';
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
  } = watchUserInfoController((state) => ({
    activities: state.activeAccount?.activities,
    members: state.activeAccount?.members,
    providerId: state.activeAccount?._id,
    roles: state.activeUser?.roles,
  }));

  useEffect(() => {
    sessionRead<OrderWithoutId>('orderLast').then((orderLast) => {
      if (orderLast) {
        updateUserInfoController({ activeSymbol: orderLast.symbol });
      }
    });
  }, []);

  const { isTraderAccount } = getRoleProvider(roles, providerId);

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
        {isTraderAccount && (
          <Button onClick={onEdit} rightIcon={<Icon name="Add" />}>
            New Order
          </Button>
        )}
        <TodayOrders />
        <AccountActivities activities={activities} members={members as any} />
      </Group>
    </>
  );
}

export default OpenOrder;
