import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { PlanType } from '@fishprovider/utils/dist/constants/account';
import type { Lock } from '@fishprovider/utils/dist/types/Account.model';

import BotChips from '~components/account/BotChips';
import LockTypeInfo from '~components/account/LockTypeInfo';
import Box from '~ui/core/Box';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Popover from '~ui/core/Popover';
import Text from '~ui/core/Text';

interface Props {
  providerId: string,
}

function AccInfo({
  providerId,
}: Props) {
  const {
    balance = 0,
    leverage,
    asset = 'USD',
    locks = [],
    tradeSettings,
    protectSettings,
    settings,
    plan = [],
  } = storeAccounts.useStore((state) => ({
    balance: state[providerId]?.balance,
    leverage: state[providerId]?.leverage,
    asset: state[providerId]?.asset,
    locks: state[providerId]?.locks,
    tradeSettings: state[providerId]?.tradeSettings,
    protectSettings: state[providerId]?.protectSettings,
    settings: state[providerId]?.settings,
    plan: state[providerId]?.plan,
  }));

  const skipClick = (e: React.SyntheticEvent) => e.preventDefault();

  const renderLock = (lock: Lock, index: number) => (
    <Box key={index}>
      <LockTypeInfo lock={lock} />
    </Box>
  );

  const monthTarget = plan.find((item) => item.type === PlanType.monthTargetLock)
    ?.value as number;

  return (
    <Popover content={(
      <>
        {leverage ? <Text>{`Leverage 1:${leverage}`}</Text> : null}
        {monthTarget ? <Text>{`Target (Month): ${monthTarget}`}</Text> : null}
        <BotChips
          tradeSettings={tradeSettings}
          protectSettings={protectSettings}
          settings={settings}
        />
        {locks.length > 0 ? (
          <Group spacing="xs">
            <Text>Locks:</Text>
            {locks.map(renderLock)}
          </Group>
        ) : null}
      </>
    )}
    >
      <Group spacing={0} onClick={skipClick}>
        <Text>{`Balance: ${balance} ${asset}`}</Text>
        <Icon name="Info" button />
      </Group>
    </Popover>
  );
}

export default AccInfo;
