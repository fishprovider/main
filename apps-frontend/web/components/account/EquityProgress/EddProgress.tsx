import { AccountPlanType } from '@fishprovider/core';
import _ from 'lodash';

import { watchAccountController } from '~controllers/account.controller';
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

function EddProgress({ providerId, profit }: Props) {
  const {
    balance = 0,
    maxEquity = balance as number,
    plans,
  } = watchAccountController((state) => ({
    balance: state[providerId]?.balance,
    maxEquity: state[providerId]?.maxEquity,
    plans: state[providerId]?.plan,
  }));

  const dayMaxEdd = plans?.find((plan) => plan.type === AccountPlanType.dayMaxEddLock)
    ?.value as number | undefined;

  if (!dayMaxEdd) return null;

  const minEquity = maxEquity + dayMaxEdd; // dayMaxEdd <= 0
  const equity = balance + profit;
  const edd = Math.min(0, equity - maxEquity); // edd <= 0
  const progress = (100 * edd) / dayMaxEdd;

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
        <Text size="sm">{`${_.round(edd, 2)} (${_.round(progress, 2)}%)`}</Text>
      </Box>
      <Box pos="absolute" top={40} left={0}>
        <Text size="sm" color="red">{`${_.round(minEquity, 2)} (${dayMaxEdd})`}</Text>
      </Box>
      <Box pos="absolute" top={40} right={0}>
        <Text size="sm">{_.round(maxEquity, 2)}</Text>
      </Box>
    </Box>
  );
}

export default EddProgress;
