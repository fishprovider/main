import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

import InvestNow from '~components/account/InvestNow';
import Link from '~components/base/Link';
import { toStrategy } from '~libs/routes';
import Badge from '~ui/core/Badge';
import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Loader from '~ui/core/Loader';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import { getRiskScoreColor, getRiskScoreText } from '~utils/account';

const defaultTopProviders: Record<string, Partial<Account>> = {
  earth: {
    name: 'Earth',
    icon: '🍀',
    riskScore: 1,
    winRate: 90,
    maxYearProfit: 24,
    roi: 15.21,
    createdAt: new Date('2022-12-01T10:00:00.000+1000'),
  },
  water: {
    name: 'Water',
    icon: '🌊',
    riskScore: 2,
    winRate: 80,
    maxYearProfit: 48,
    roi: 37.63,
    createdAt: new Date('2022-10-01T10:00:00.000+1000'),
  },
  air: {
    name: 'Air',
    icon: '🌪️',
    riskScore: 3,
    winRate: 70,
    maxYearProfit: 72,
    roi: 39.37,
    createdAt: new Date('2022-11-01T10:00:00.000+1000'),
  },
  fire: {
    name: 'Fire',
    icon: '🔥',
    riskScore: 4,
    winRate: 60,
    maxYearProfit: 96,
    roi: 58.05,
    createdAt: new Date('2022-11-01T10:00:00.000+1000'),
  },
};

interface Props {
  providerId: string,
}

function ProviderCardTop({ providerId }: Props) {
  const account = storeAccounts.useStore((state) => state[providerId]);
  const {
    name,
    icon,
    createdAt,
    riskScore,
    winRate,
    maxYearProfit = 0,
    roi = 0,
    summary = {},
  } = account || defaultTopProviders[providerId] || {};

  const profit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;

  return (
    <Link href={toStrategy(providerId)} variant="clean">
      <Card withBorder shadow="xl" miw={280} ta="center">
        <Stack>
          <Group position="center">
            <Badge color={getRiskScoreColor(riskScore)} variant="filled">
              {getRiskScoreText(riskScore)}
            </Badge>
            {winRate && (
              <Badge color="blue" variant="filled">
                Win Rate
                {' '}
                {winRate}
                %
              </Badge>
            )}
          </Group>
          <Title size="h3">{name || <Loader variant="dots" />}</Title>
          <Title size="h2">{icon || <Loader variant="bars" size="sm" />}</Title>
          <Box>
            <Text>
              Target:
              {' '}
              <Text fw={700} span c="orange">{`${maxYearProfit}%/year`}</Text>
            </Text>
            <Text>
              Active:
              {' '}
              <Text fw={700} span c="blue">
                {moment.duration(moment().diff(moment(createdAt))).humanize()}
              </Text>
            </Text>
            <Text>
              All-Time Profit:
              {' '}
              <Text fw={700} span c="green">{`${profit}%`}</Text>
            </Text>
            <Text>
              Avg. Profit:
              {' '}
              <Text fw={700} span c="grape">{`${_.round(profit / activeMonths, 2)}%/month`}</Text>
            </Text>
          </Box>
          <InvestNow providerId={providerId} />
        </Stack>
      </Card>
    </Link>
  );
}

export default ProviderCardTop;
