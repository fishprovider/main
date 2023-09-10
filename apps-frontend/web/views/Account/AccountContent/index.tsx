import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import _ from 'lodash';
import dynamic from 'next/dynamic';

import Icon from '~ui/core/Icon';
import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';
import Tabs from '~ui/core/Tabs';

const Trade = dynamic(() => import('./Trade'), { loading: () => <Skeleton height={500} /> });
const Idea = dynamic(() => import('./Idea'), { loading: () => <Skeleton height={500} /> });
const History = dynamic(() => import('./History'), { loading: () => <Skeleton height={500} /> });
const Admin = dynamic(() => import('./Admin'), { loading: () => <Skeleton height={500} /> });

const getCountText = (count: number) => (count ? `(${count})` : '');

function AccountContent() {
  const {
    providerId = '',
    hasCopy,
    roles,
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    hasCopy: _.keys(state.activeProvider?.settings?.parents).length,
    roles: state.info?.roles,
  }));
  const tradeCount = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId
      && [OrderStatus.live, OrderStatus.pending].includes(item.status),
  ).length);
  const ideaCount = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId && item.status === OrderStatus.idea,
  ).length);

  const { isAdminProvider, isTraderProvider } = getRoleProvider(roles, providerId);

  const tabs = [
    {
      value: 'trade',
      label: `Trade ${getCountText(tradeCount)}`,
      icon: <Icon name="AccountBalanceWallet" />,
    },
    ...(isTraderProvider && hasCopy ? [{
      value: 'idea',
      label: `Idea ${getCountText(ideaCount)}`,
      icon: <Icon name="Lightbulb" />,
    }] : []),
    {
      value: 'history',
      label: 'History',
      icon: <Icon name="History" />,
    },
    ...(isAdminProvider ? [{
      value: 'admin',
      label: 'Admin',
      icon: <Icon name="AdminPanelSettings" />,
    }] : []),
  ];

  return (
    <Tabs defaultValue="trade">
      <Tabs.List>
        {tabs.map(({ value, label, icon }) => (
          <Tabs.Tab key={value} value={value}>
            <Stack align="center" spacing="xs">
              {icon}
              {label}
            </Stack>
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panel value="trade">
        <Trade />
      </Tabs.Panel>
      <Tabs.Panel value="idea">
        <Idea />
      </Tabs.Panel>
      <Tabs.Panel value="history">
        <History />
      </Tabs.Panel>
      <Tabs.Panel value="admin">
        <Admin />
      </Tabs.Panel>
    </Tabs>
  );
}

export default AccountContent;
