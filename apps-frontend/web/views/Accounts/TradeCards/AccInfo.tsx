import { AccountLock } from '@fishprovider/core';

import BotChips from '~components/account/BotChips';
import TargetProgress from '~components/account/EquityProgress/TargetProgress';
import LockTypeInfo from '~components/account/LockTypeInfo';
import { watchAccountController } from '~controllers/account.controller';
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
  } = watchAccountController((state) => ({
    balance: state[providerId]?.balance,
    leverage: state[providerId]?.leverage,
    asset: state[providerId]?.asset,
    locks: state[providerId]?.locks,
    tradeSettings: state[providerId]?.tradeSettings,
    protectSettings: state[providerId]?.protectSettings,
    settings: state[providerId]?.settings,
  }));

  const skipClick = (e: React.SyntheticEvent) => e.preventDefault();

  const renderLock = (lock: AccountLock, index: number) => (
    <Box key={index}>
      <LockTypeInfo lock={lock} />
    </Box>
  );

  return (
    <Popover content={(
      <>
        <TargetProgress providerId={providerId} />
        {leverage ? <Text>{`Leverage 1:${leverage}`}</Text> : null}
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
