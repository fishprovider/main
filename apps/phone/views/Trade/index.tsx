import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useState } from 'react';

import StrategyController from '~controllers/StrategyController';
import Select from '~ui/Select';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

import ListTrade from './ListTrade';
import TradeWatch from './TradeWatch';

function Header() {
  const {
    balance = 0,
  } = storeUser.useStore((state) => ({
    balance: state.activeProvider?.balance,
  }));

  return (
    <Stack>
      <Text>
        Balance:
        {' '}
        {balance}
      </Text>
    </Stack>
  );
}

function Account() {
  return (
    <Stack>
      <TradeWatch />
      <Header />
      <ListTrade />
    </Stack>
  );
}

export default function Trade() {
  const options = storeAccounts.useStore((state) => _.map(state, (item) => ({
    value: item._id,
    label: `${item.name} ${item.icon || ''}`,
  })));

  const [selectedProviderId, setSelectedProviderId] = useState<string>();

  if (!options.length) return null;

  const providerId = selectedProviderId || options[0].value;
  return (
    <Stack paddingHorizontal="$2">
      <Select
        options={options}
        value={providerId}
        onChange={setSelectedProviderId}
      />
      <StrategyController providerId={providerId}>
        <Account />
      </StrategyController>
    </Stack>
  );
}
