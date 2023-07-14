import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';

import Link from '~components/base/Link';
import AccountActivities from '~components/order/OpenOrder/AccountActivities';
import { ProviderTypeText } from '~constants/account';
import { toAccount } from '~libs/routes';
import Badge from '~ui/core/Badge';
import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Grid from '~ui/core/Grid';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Tooltip from '~ui/core/Tooltip';

import AccInfo from './AccInfo';
import CopyStatus from './CopyStatus';
import TradeInfo from './TradeInfo';

interface Props {
  providerId: string,
}

function TradeCard({
  providerId,
}: Props) {
  const {
    providerType = ProviderType.icmarkets,
    name = '-',
    icon = '-',
    members = [],
    locks = [],
    tradeSettings = {},
    protectSettings = {},
    settings = {},
    activities = {},
  } = storeAccounts.useStore((state) => ({
    providerType: state[providerId]?.providerType,
    name: state[providerId]?.name,
    icon: state[providerId]?.icon,
    members: state[providerId]?.members,
    locks: state[providerId]?.locks,
    tradeSettings: state[providerId]?.tradeSettings,
    protectSettings: state[providerId]?.protectSettings,
    settings: state[providerId]?.settings,
    activities: state[providerId]?.activities,
  }));

  const hasLock = locks.length > 0;
  const hasTarget = locks.some((lock) => lock.value === 'monthTarget');
  const hasCopy = settings.enableCopyParent && _.size(settings.parents) > 0;
  const hasEquityLock = protectSettings.enabledEquityLock && !!protectSettings.equityLock;
  const hasOrderCloseTime = !!tradeSettings.enabledCloseTime;

  const skipClick = (e: React.SyntheticEvent) => e.preventDefault();

  const renderLeft = () => (
    <Stack spacing="xs">
      <Group>
        <Text>{name}</Text>
        <Text>{icon}</Text>
      </Group>
      <Group spacing="xs">
        <Badge variant="filled">{ProviderTypeText[providerType] || providerType}</Badge>
        {hasCopy && <CopyStatus providerId={providerId} />}
        {hasLock && <Icon name="Lock" button tooltip="Locked" color="red" onClick={skipClick} />}
        {hasTarget && <Tooltip label="Target Passed">🎉</Tooltip>}
        {hasEquityLock && <Icon name="Security" button tooltip="Equity Lock" color="green" onClick={skipClick} />}
        {hasOrderCloseTime && <Icon name="SafetyCheck" button tooltip="Order Close Time" color="green" onClick={skipClick} />}
      </Group>
    </Stack>
  );

  const renderRight = () => (
    <Group position="apart">
      <Box>
        <AccInfo providerId={providerId} />
        <TradeInfo providerId={providerId} />
      </Box>
      <Group position="right">
        <Icon name="ArrowForward" button />
      </Group>
    </Group>
  );

  return (
    <Link href={toAccount(providerId)} variant="clean">
      <Card withBorder>
        <Grid>
          <Grid.Col xs={4}>
            {renderLeft()}
          </Grid.Col>
          <Grid.Col xs={3}>
            <AccountActivities activities={activities} members={members} />
          </Grid.Col>
          <Grid.Col xs={5}>
            {renderRight()}
          </Grid.Col>
        </Grid>
      </Card>
    </Link>
  );
}

export default TradeCard;
