import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import * as WebBrowser from 'expo-web-browser';
import _ from 'lodash';
import moment from 'moment';

import Button from '~ui/Button';
import Card from '~ui/Card';
import Group from '~ui/Group';
import H6 from '~ui/H6';
import { useModalSimple } from '~ui/ModalProvider';
import Stack from '~ui/Stack';
import Text from '~ui/Text';
import ThemeProvider from '~ui/ThemeProvider';

import InvestModal from './InvestModal';

interface Props {
  providerId: string;
}

export default function ProviderCard({ providerId }: Props) {
  const {
    mode = 'live',
  } = storeUser.useStore((state) => ({
    mode: state.mode,
  }));

  const {
    name = '-',
    icon = '-',
    createdAt,
    // riskScore,
    // winRate,
    maxYearProfit = 0,
    roi = 0,
    summary = {},
  } = storeAccounts.useStore((state) => ({
    name: state[providerId]?.name,
    icon: state[providerId]?.icon,
    createdAt: state[providerId]?.createdAt,
    // riskScore: state[providerId]?.riskScore,
    // winRate: state[providerId]?.winRate,
    maxYearProfit: state[providerId]?.maxYearProfit,
    roi: state[providerId]?.roi,
    summary: state[providerId]?.summary,
  }));

  const profit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;

  const [showModal] = useModalSimple({
    title: <H6>How to Invest</H6>,
    content: <InvestModal providerId={providerId} />,
  });

  const onInvest = () => {
    const isDev = false;
    if (isDev) {
      showModal();
      return;
    }
    WebBrowser.openBrowserAsync(mode === 'live'
      ? `https://www.fishprovider.com/strategies/${providerId}`
      : `https://demo.fishprovider.com/strategies/${providerId}`);
  };

  const target = `${maxYearProfit}%/year`;
  const allTimeProfit = `${profit}%`;
  const active = moment.duration(moment().diff(moment(createdAt))).humanize();
  const avgProfit = `${_.round(profit / activeMonths, 2)}%/month`;

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
                <Text color="orange">{target}</Text>
              </Text>
              <Text>
                All-Time Profit:
                {' '}
                <Text color="green">{allTimeProfit}</Text>
              </Text>
              <Text>
                Active:
                {' '}
                <Text color="blue">{active}</Text>
              </Text>
              <Text>
                Avg. Profit:
                {' '}
                <Text color="purple">{avgProfit}</Text>
              </Text>
            </Stack>
          </Group>
        </Card.Header>
      </Card>
    </ThemeProvider>
  );
}
