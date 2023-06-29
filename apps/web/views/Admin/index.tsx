import Stack from '~ui/core/Stack';
import Tabs from '~ui/core/Tabs';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

import AdminTrade from './AdminTrade';
import AdminTransaction from './AdminTransaction';
import AdminWallet from './AdminWallet';

function Admin() {
  return (
    <ContentSection>
      <Stack py="xl">
        <Title>Admin</Title>
        <Tabs defaultValue="trade">
          <Tabs.List>
            <Tabs.Tab value="trade">
              <Title size="h4">Trade</Title>
            </Tabs.Tab>
            <Tabs.Tab value="transaction">
              <Title size="h4">Transaction</Title>
            </Tabs.Tab>
            <Tabs.Tab value="wallet">
              <Title size="h4">Wallet</Title>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="trade" pt="md">
            <AdminTrade />
          </Tabs.Panel>
          <Tabs.Panel value="transaction" pt="md">
            <AdminTransaction />
          </Tabs.Panel>
          <Tabs.Panel value="wallet" pt="md">
            <AdminWallet />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </ContentSection>
  );
}

export default Admin;
