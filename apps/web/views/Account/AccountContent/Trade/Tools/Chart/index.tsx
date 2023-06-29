import Tabs from '~ui/core/Tabs';
import Text from '~ui/core/Text';

import ChartNew from './ChartNew';
import ChartTradingView from './ChartTradingView';

function Chart() {
  return (
    <Tabs defaultValue="view" variant="pills">
      <Tabs.List position="center">
        <Tabs.Tab value="view">
          <Text>View</Text>
        </Tabs.Tab>
        <Tabs.Tab value="new">
          <Text>New</Text>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="view" pt="md">
        <ChartTradingView />
      </Tabs.Panel>
      <Tabs.Panel value="new" pt="md">
        <ChartNew />
      </Tabs.Panel>
    </Tabs>
  );
}

export default Chart;
