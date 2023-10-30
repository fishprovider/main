import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import AccountController from '~controllers/AccountController';
import { cacheRead, cacheWrite } from '~libs/cache';
import { getAccountsService } from '~services/account/getAccounts.service';
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
  const {
    userId = '',
    email,
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    email: state.info?.email,
  }));

  const options = storeAccounts.useStore((state) => _.orderBy(
    _.filter(state, (item) => {
      if (item.userId && item.userId === userId) return true;
      if (item.members?.some((itemMember) => itemMember.userId === userId)) return true;
      return false;
    }),
    (item) => {
      const activity = item.activities?.[userId];
      if (!activity) return 0;
      return new Date(activity.lastView).getTime();
    },
    ['desc'],
  ).map((item) => ({
    value: item._id,
    label: `${item.name} ${item.icon || ''}`,
  })));

  useQuery({
    queryFn: () => getAccountsService({ email }),
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
    return options[0]?.value || '';
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
      <AccountController providerId={providerId}>
        <ScrollView>
          <Stack space="$4">
            <TradeWatch />
            <TradeHeader />
            <NewOrder />
            <ListTrade />
          </Stack>
        </ScrollView>
      </AccountController>
    </Stack>
  );
}
