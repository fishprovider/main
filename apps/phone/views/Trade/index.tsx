import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import StrategyController from '~controllers/StrategyController';
import { cacheRead, cacheWrite } from '~libs/cache';
import ScrollView from '~ui/ScrollView';
import Select from '~ui/Select';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

import ListTrade from './ListTrade';
import OpenOrder from './OpenOrder';
import TradeHeader from './TradeHeader';
import TradeWatch from './TradeWatch';

export default function Trade() {
  const userId = storeUser.useStore((state) => state.info?._id);

  const options = storeAccounts.useStore((state) => _.filter(state, (item) => {
    if (item.userId && item.userId === userId) return true;
    if (item.members?.some((itemMember) => itemMember.userId === userId)) return true;
    return false;
  }).map((item) => ({
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

  if (!options.length) {
    return (
      <Stack center>
        <Text>N.A.</Text>
      </Stack>
    );
  }

  const getProviderId = () => {
    if (selectedProviderId) return selectedProviderId;
    if (defaultProviderId && options.some((item) => item.value === defaultProviderId)) {
      return defaultProviderId;
    }
    return options[0].value;
  };
  const providerId = getProviderId();

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
        <ScrollView>
          <Stack space="$4">
            <TradeWatch />
            <TradeHeader />
            <OpenOrder />
            <ListTrade />
          </Stack>
        </ScrollView>
      </StrategyController>
    </Stack>
  );
}
