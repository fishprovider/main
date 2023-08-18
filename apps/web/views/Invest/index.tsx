import Routes from '~libs/routes';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Tabs from '~ui/core/Tabs';
import Title from '~ui/core/Title';

import InvestActive from './InvestActive';
import InvestInactive from './InvestInactive';
import InvestPending from './InvestPending';

function Invest() {
  return (
    <Stack py="xs">
      <Group>
        <Title>Investment Wallets</Title>
        <Icon name="Add" href={Routes.strategies} button buttonProps={{ variant: 'light' }} size="large" color="primary" />
      </Group>
      <Tabs defaultValue="active">
        <Tabs.List>
          <Tabs.Tab value="active">
            <Title size="h4">Active</Title>
          </Tabs.Tab>
          <Tabs.Tab value="pending">
            <Title size="h4">Pending</Title>
          </Tabs.Tab>
          <Tabs.Tab value="inactive">
            <Title size="h4">Inactive</Title>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="active" pt="md">
          <InvestActive />
        </Tabs.Panel>
        <Tabs.Panel value="pending" pt="md">
          <InvestPending />
        </Tabs.Panel>
        <Tabs.Panel value="inactive" pt="md">
          <InvestInactive />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

export default Invest;
