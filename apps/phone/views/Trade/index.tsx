import accountGetManyUser from '@fishprovider/cross/dist/api/accounts/getManyUser';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
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
import { refreshMS } from '~utils';

import ListTrade from './ListTrade';
import NewOrder from './NewOrder';
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

  useQuery({
    queryFn: accountGetManyUser,
    queryKey: queryKeys.userAccounts(),
    refetchInterval: refreshMS,
  });

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
    <Stack padding="$2">
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
            <NewOrder />
            <ListTrade />
          </Stack>
        </ScrollView>
      </StrategyController>
    </Stack>
  );
}
