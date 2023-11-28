import * as WebBrowser from 'expo-web-browser';
import _ from 'lodash';
import moment from 'moment';

import { watchAccountController } from '~controllers/account.controller';
import { watchUserController } from '~controllers/user.controller';
import Button from '~ui/Button';
import Card from '~ui/Card';
import Group from '~ui/Group';
import H6 from '~ui/H6';
import Stack from '~ui/Stack';
import Text from '~ui/Text';
import ThemeProvider from '~ui/ThemeProvider';

interface Props {
  providerId: string;
}

export default function ProviderCard({ providerId }: Props) {
  const {
    mode = 'live',
  } = watchUserController((state) => ({
    mode: state.mode,
  }));

  const {
    name = '-',
    icon = '-',
    createdAt,
    // riskScore,
    // winRate,
    monthProfit = 0,
    roi = 0,
    summary = {},
  } = watchAccountController((state) => ({
    name: state[providerId]?.name,
    icon: state[providerId]?.icon,
    createdAt: state[providerId]?.createdAt,
    // riskScore: state[providerId]?.riskScore,
    // winRate: state[providerId]?.winRate,
    monthProfit: state[providerId]?.monthProfit,
    roi: state[providerId]?.roi,
    summary: state[providerId]?.summary,
  }));

  const totalProfit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;
  const avgProfit = totalProfit / activeMonths;

  const onInvest = () => {
    WebBrowser.openBrowserAsync(mode === 'live'
      ? `https://www.fishprovider.com/strategies/${providerId}?notrack=true`
      : `https://demo.fishprovider.com/strategies/${providerId}?notrack=true`);
  };

  return (
    <ThemeProvider name="light">
      <Card elevate bordered>
        <Card.Header padded>
          <Group>
            <Stack width={150}>
              <H6>{name}</H6>
              <Text>{icon}</Text>
              <Button color="white" backgroundColor="green" size="$3" width={110} onPress={onInvest}>
                Invest ➜ 🏦
              </Button>
            </Stack>
            <Stack justifyContent="center">
              <Text>
                Target:
                {' '}
                <Text color="orange">{`${monthProfit}%/month`}</Text>
              </Text>
              <Text>
                Total Profit:
                {' '}
                <Text color="green">{`${totalProfit}%`}</Text>
              </Text>
              <Text>
                Active:
                {' '}
                <Text color="blue">{moment.duration(moment().diff(moment(createdAt))).humanize()}</Text>
              </Text>
              <Text>
                Avg. Profit:
                {' '}
                <Text color="purple">{`${_.round(avgProfit, 2)}%/month`}</Text>
              </Text>
            </Stack>
          </Group>
        </Card.Header>
      </Card>
    </ThemeProvider>
  );
}
