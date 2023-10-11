import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { ProviderViewType } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import moment from 'moment';
import type React from 'react';

import InvestNow from '~components/account/InvestNow';
import Link from '~components/base/Link';
import {
  CardVariant, ProviderViewTypeText,
} from '~constants/account';
import { toStrategy } from '~libs/routes';
import Badge from '~ui/core/Badge';
import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Loader from '~ui/core/Loader';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import useMobile from '~ui/styles/useMobile';
import { getRiskScoreColor, getRiskScoreText } from '~utils/account';

interface Props {
  providerId: string,
  variant?: string,
}

function ProviderCard({
  providerId,
  variant = CardVariant.default,
}: Props) {
  const isMobile = useMobile();

  const {
    providerViewType,
    name,
    icon,
    createdAt,
    riskScore,
    winRate,
    monthProfit = 0,
    roi = 0,
    summary = {},
  } = storeAccounts.useStore((state) => ({
    providerViewType: state[providerId]?.providerViewType,
    name: state[providerId]?.name,
    icon: state[providerId]?.icon,
    createdAt: state[providerId]?.createdAt,
    riskScore: state[providerId]?.riskScore,
    winRate: state[providerId]?.winRate,
    monthProfit: state[providerId]?.monthProfit,
    roi: state[providerId]?.roi,
    summary: state[providerId]?.summary,
  }));

  const totalProfit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;
  const avgProfit = totalProfit / activeMonths;

  const renderCardBig = () => (
    <Link href={toStrategy(providerId)} variant="clean">
      <Card withBorder shadow="xl" miw={300} maw={300} ta="center">
        <Stack>
          <Group position="center">
            <Badge color={getRiskScoreColor(riskScore)} variant="filled">{getRiskScoreText(riskScore)}</Badge>
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
              <Text fw={700} span c="orange">{`${monthProfit}%/month`}</Text>
            </Text>
            <Text>
              Total Profit:
              {' '}
              <Text fw={700} span c="green">{`${totalProfit}%`}</Text>
            </Text>
            <Text>
              Active:
              {' '}
              <Text fw={700} span c="blue">
                {moment.duration(moment().diff(moment(createdAt))).humanize()}
              </Text>
            </Text>
            <Text>
              Avg. Profit:
              {' '}
              <Text fw={700} span c="grape">{`${_.round(avgProfit, 2)}%/month`}</Text>
            </Text>
          </Box>
          <Group position="center">
            {providerViewType === ProviderViewType.private && (
              <Icon
                name="VisibilityOff"
                tooltip={ProviderViewTypeText[providerViewType as ProviderViewType]}
              />
            )}
            <InvestNow providerId={providerId} />
          </Group>
        </Stack>
      </Card>
    </Link>
  );

  const renderCardSlim = () => (
    <Link href={toStrategy(providerId)} variant="clean">
      <Card withBorder shadow="xl" miw={200} maw={400} ta="center">
        <Stack spacing="xs">
          <Group position="center">
            <Badge color={getRiskScoreColor(riskScore)} variant="filled" size="sm">{getRiskScoreText(riskScore)}</Badge>
            {winRate && (
              <Badge color="blue" variant="filled" size="sm">
                Win Rate
                {' '}
                {winRate}
                %
              </Badge>
            )}
          </Group>
          <Group position="apart">
            <Stack maw={150} spacing="xs">
              <Title size="h4">{name || <Loader variant="dots" size="xs" />}</Title>
              <Title size="h3">{icon || <Loader variant="bars" size="xs" />}</Title>
              <Group position="center">
                {providerViewType === ProviderViewType.private && (
                  <Icon
                    name="VisibilityOff"
                    tooltip={ProviderViewTypeText[providerViewType as ProviderViewType]}
                  />
                )}
                <InvestNow providerId={providerId} size="sm" />
              </Group>
            </Stack>
            <Box>
              <Text size="sm">
                Target:
                {' '}
                <Text fw={700} span c="orange">{`${monthProfit}%/month`}</Text>
              </Text>
              <Text size="sm">
                Total Profit:
                {' '}
                <Text fw={700} span c="green">{`${totalProfit}%`}</Text>
              </Text>
              <Text size="sm">
                Active:
                {' '}
                <Text fw={700} span c="blue">
                  {moment.duration(moment().diff(moment(createdAt))).humanize()}
                </Text>
              </Text>
              <Text size="sm">
                Avg. Profit:
                {' '}
                <Text fw={700} span c="grape">{`${_.round(avgProfit, 2)}%/month`}</Text>
              </Text>
            </Box>
          </Group>
        </Stack>
      </Card>
    </Link>
  );

  if (variant === CardVariant.big) return renderCardBig();
  if (variant === CardVariant.slim) return renderCardSlim();
  return isMobile ? renderCardSlim() : renderCardBig();
}

export default ProviderCard;
