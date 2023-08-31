import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderPlatform } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import moment from 'moment';

import InvestNow from '~components/account/InvestNow';
import MonthProfit from '~components/account/MonthProfit';
import TradeNow from '~components/account/TradeNow';
import Badge from '~ui/core/Badge';
import Box from '~ui/core/Box';
import Grid from '~ui/core/Grid';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import { getRiskScoreColor, getRiskScoreText } from '~utils/account';

import CTraderStats from './CTraderStats';

function InvestorStats() {
  const {
    providerId = '',
    providerPlatform,
    edd = 0,
    createdAt,
    capital = 0,
    riskScore,
    winRate,
    maxYearProfit = 0,
    roi = 0,
    summary = {},
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    providerPlatform: state.activeProvider?.providerPlatform,
    edd: state.activeProvider?.edd,
    createdAt: state.activeProvider?.createdAt,
    capital: state.activeProvider?.capital,
    riskScore: state.activeProvider?.riskScore,
    winRate: state.activeProvider?.winRate,
    maxYearProfit: state.activeProvider?.maxYearProfit,
    roi: state.activeProvider?.roi,
    summary: state.activeProvider?.summary,
  }));

  const profit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;

  return (
    <Stack>
      <Grid>
        <Grid.Col xs={12} sm={4}>
          <Stack>
            <Group>
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
            <Box>
              <Text>
                🎯 Target:
                {' '}
                <Text fw={700} span c="orange">{`${maxYearProfit}% / year`}</Text>
              </Text>
              <Text>
                🏊 Active:
                {' '}
                <Text fw={700} span c="blue">
                  {moment.duration(moment().diff(moment(createdAt))).humanize()}
                </Text>
              </Text>
              <Text>
                💰 All-Time Profit:
                {' '}
                <Text fw={700} span c="green">{`${profit}%`}</Text>
              </Text>
              <Text>
                🗓️ Average Profit:
                {' '}
                <Text fw={700} span c="grape">
                  {`${_.round(profit / activeMonths, 2)}%/month`}
                </Text>
              </Text>
              <Text>
                🏦 Capital:
                {' '}
                <Text fw={700} span c="yellow">{`${capital} USD`}</Text>
              </Text>
              <Text>
                📉 Max EDD:
                {' '}
                <Text fw={700} span c="red">{`${edd}%`}</Text>
              </Text>
            </Box>
            <Group>
              <InvestNow providerId={providerId} />
              <TradeNow providerId={providerId} />
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col xs={12} sm={8}>
          <Stack align="center">
            <MonthProfit providerId={providerId} />
            {providerPlatform === ProviderPlatform.ctrader && <CTraderStats />}
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default InvestorStats;
