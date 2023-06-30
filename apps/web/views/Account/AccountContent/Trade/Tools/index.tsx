import storeUser from '@fishbot/cross/stores/user';
import moment from 'moment';
import dynamic from 'next/dynamic';

import Icon from '~ui/core/Icon';
import Indicator from '~ui/core/Indicator';
import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';
import Tabs from '~ui/core/Tabs';

const TechAnalysis = dynamic(() => import('./TechAnalysis'), { loading: () => <Skeleton height={400} /> });
const FundAnalysis = dynamic(() => import('./FundAnalysis'), { loading: () => <Skeleton height={200} /> });
const TradingPlan = dynamic(() => import('./TradingPlan'), { loading: () => <Skeleton height={200} /> });
const Chart = dynamic(() => import('./Chart'), { loading: () => <Skeleton height={400} /> });

function AccountTools() {
  const planUpdatedAt = storeUser.useStore((state) => state.activeProvider?.planUpdatedAt);

  const tabs = [
    {
      value: 'fa',
      label: 'FA',
      icon: <Icon name="Newspaper" />,
    },
    {
      value: 'ta',
      label: 'TA',
      icon: <Icon name="WaterfallChart" />,
    },
    {
      value: 'chart',
      label: 'Chart',
      icon: <Icon name="CandlestickChart" />,
    },
    {
      value: 'plan',
      label: 'Plan',
      icon: (
        <Indicator label={`${moment().diff(moment(planUpdatedAt), 'd')}d`} size={16}>
          <Icon name="Gavel" />
        </Indicator>
      ),
    },
  ];

  return (
    <Tabs defaultValue="fa" pt="md">
      <Tabs.List>
        {tabs.map(({ value, label, icon }) => (
          <Tabs.Tab key={value} value={value}>
            <Stack align="center" spacing="xs">
              {icon}
              {label}
            </Stack>
          </Tabs.Tab>
        ))}
      </Tabs.List>

      <Tabs.Panel value="fa" pt="md">
        <FundAnalysis />
      </Tabs.Panel>
      <Tabs.Panel value="ta" pt="md">
        <TechAnalysis />
      </Tabs.Panel>
      <Tabs.Panel value="chart" pt="md">
        <Chart />
      </Tabs.Panel>
      <Tabs.Panel value="plan" pt="md">
        <TradingPlan />
      </Tabs.Panel>
    </Tabs>
  );
}

export default AccountTools;
