import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { PlanType } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';

import Box from '~ui/core/Box';
import Text from '~ui/core/Text';

import { ProgressStyled } from './styles';

const targetIcons = [
  { ratio: 100, icon: '🎯' },
  { ratio: 80, icon: '✈️' },
  { ratio: 60, icon: '🏎️' },
  { ratio: 40, icon: '🚴' },
  { ratio: 20, icon: '🏃' },
  { ratio: 0, icon: '🏁' },
];

interface Props {
  providerId: string,
  profit: number,
  slim?: boolean,
}

function TargetProgress({ providerId, profit, slim }: Props) {
  const {
    balance = 0,
    balanceStart,
    plans,
  } = storeAccounts.useStore((state) => ({
    balance: state[providerId]?.balance,
    balanceStart: state[providerId]?.balanceStart,
    plans: state[providerId]?.plan,
  }));

  const target = plans?.find((plan) => plan.type === PlanType.monthTargetLock)
    ?.value as number | undefined;

  if (!balanceStart || !target) return null;

  const targetAmt = target - balanceStart;
  const equity = balance + profit;
  const progressAmt = Math.max(0, equity - balanceStart);
  const progress = (100 * progressAmt) / targetAmt;

  const offset = slim ? 20 : 0;

  return (
    <Box h={60 - offset * 2} w={200} pos="relative">
      {slim ? null : targetIcons.map((item) => (
        <Box key={item.ratio} pos="absolute" top={0} right={`${100 - item.ratio - 8}%`}>
          <Text>{item.icon}</Text>
        </Box>
      ))}
      <Box pos="absolute" top={20 - offset} left={0} right={0}>
        <ProgressStyled value={progress} color="green" h={20} radius={0} animate={profit !== 0} />
      </Box>
      <Box pos="absolute" top={20 - offset} left={0} right={0} ta="center">
        <Text size="sm">{`${_.round(progressAmt, 2)} (${_.round(progress, 2)}%)`}</Text>
      </Box>
      {slim ? null : (
        <Box pos="absolute" top={40 - offset} right={0}>
          <Text size="sm" color="green">{_.round(target, 2)}</Text>
        </Box>
      )}
    </Box>
  );
}

export default TargetProgress;
