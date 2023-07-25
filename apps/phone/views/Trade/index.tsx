import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import StrategyController from '~controllers/StrategyController';
import { cacheRead, cacheWrite } from '~libs/cache';
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

  const [defaultProviderId, setDefaultProviderId] = useState<string>();
  const [selectedProviderId, setSelectedProviderId] = useState<string>();

  useEffect(() => {
    cacheRead<string>('fp-providerId').then((cache) => {
      if (cache) {
        setDefaultProviderId(cache);
      }
    });
  }, []);

  if (!options.length) return null;

  const providerId = selectedProviderId || defaultProviderId || options[0].value;

  const onSelect = (value: string) => {
    setSelectedProviderId(value);
    cacheWrite('fp-providerId', value);
  };

  return (
    <Stack paddingHorizontal="$2">
      <Select
        options={options}
        value={providerId}
        onChange={onSelect}
      />
      <StrategyController providerId={providerId}>
        <Account />
      </StrategyController>
    </Stack>
  );
}
