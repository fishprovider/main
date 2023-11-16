import storeUser from '@fishprovider/cross/dist/stores/user';
import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
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
import MyFxBook from './MyFxBook';

function InvestorStats() {
  const {
    providerId = '',
    accountPlatform,
    createdAt,
    capital = 0,
    riskScore,
    winRate,
    monthProfit = 0,
    roi = 0,
    summary = {},
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    accountPlatform: state.activeProvider?.accountPlatform,
    createdAt: state.activeProvider?.createdAt,
    capital: state.activeProvider?.capital,
    riskScore: state.activeProvider?.riskScore,
    winRate: state.activeProvider?.winRate,
    monthProfit: state.activeProvider?.monthProfit,
    roi: state.activeProvider?.roi,
    summary: state.activeProvider?.summary,
  }));

  const totalProfit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;
  const avgProfit = totalProfit / activeMonths;
  const copyFund = summary?.copyFund || capital;

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
                <Text fw={700} span c="orange">{`${monthProfit}%/month`}</Text>
              </Text>
              <Text>
                💰 Total Profit:
                {' '}
                <Text fw={700} span c="green">{`${totalProfit}%`}</Text>
              </Text>
              <Text>
                🏊 Active:
                {' '}
                <Text fw={700} span c="blue">
                  {moment.duration(moment().diff(moment(createdAt))).humanize()}
                </Text>
              </Text>
              <Text>
                🗓️ Average Profit:
                {' '}
                <Text fw={700} span c="grape">
                  {`${_.round(avgProfit, 2)}%/month`}
                </Text>
              </Text>
              {!!copyFund && (
                <Text>
                  🏦 Copy Capital:
                  {' '}
                  <Text fw={700} span c="yellow">{`${copyFund} USD`}</Text>
                </Text>
              )}
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
            <Group position="center">
              <MyFxBook />
              {accountPlatform === AccountPlatform.ctrader && <CTraderStats />}
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default InvestorStats;
