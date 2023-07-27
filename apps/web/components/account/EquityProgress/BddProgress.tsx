import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import { PlanType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import _ from 'lodash';
import moment from 'moment';

import Box from '~ui/core/Box';
import Text from '~ui/core/Text';

import { ProgressStyled } from './styles';

const lossIcons = [
  { ratio: 100, icon: '🧘' },
  { ratio: 80, icon: '🦈' },
  { ratio: 60, icon: '🏝️' },
  { ratio: 40, icon: '🌊' },
  { ratio: 20, icon: '🏊' },
];

interface Props {
  providerId: string,
  profit: number,
}

function BddProgress({ providerId, profit }: Props) {
  const {
    balanceStartDay = 0,
    plans = [],
    asset = 'USD',
  } = storeAccounts.useStore((state) => ({
    balanceStartDay: state[providerId]?.balanceStartDay,
    plans: state[providerId]?.plan,
    asset: state[providerId]?.asset,
  }));

  const startOfDay = moment.utc().startOf('d');
  const todayOrders = storeOrders.useStore((state) => (
    _.filter(state, (order) => order.providerId === providerId
      && order.status === OrderStatus.closed
      && moment(order.createdAt) >= startOfDay)
  ));

  const dayMaxBdd = plans.find((plan) => plan.type === PlanType.dayMaxBddLock)
    ?.value as number | undefined;

  if (!dayMaxBdd) return null;

  const todayOrdersProfit = getProfit(todayOrders, {}, asset);
  const todayProfit = todayOrdersProfit + profit;

  const maxBalance = balanceStartDay;
  const minBalance = balanceStartDay + dayMaxBdd;
  const bdd = Math.min(0, todayProfit); // bdd <= 0
  const progress = (100 * bdd) / dayMaxBdd;

  return (
    <Box h={60} w={200} pos="relative">
      {lossIcons.map((item) => (
        <Box key={item.ratio} pos="absolute" top={0} left={`${100 - item.ratio}%`}>
          <Text>{item.icon}</Text>
        </Box>
      ))}
      <Box pos="absolute" top={20} left={0} right={0}>
        <ProgressStyled value={progress} color="red" h={20} radius={0} animate={profit !== 0} flip />
      </Box>
      <Box pos="absolute" top={20} left={0} right={0} ta="center">
        <Text size="sm">{`${_.round(bdd, 2)} (${_.round(progress, 2)}%)`}</Text>
      </Box>
      <Box pos="absolute" top={40} left={0}>
        <Text size="sm" color="red">{`${_.round(minBalance, 2)} (${dayMaxBdd})`}</Text>
      </Box>
      <Box pos="absolute" top={40} right={0}>
        <Text size="sm">{_.round(maxBalance, 2)}</Text>
      </Box>
    </Box>
  );
}

export default BddProgress;
