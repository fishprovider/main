import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import { getAccountsController, watchAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
import { cacheRead, cacheWrite } from '~libs/cache';
import AccountProvider from '~providers/AccountProvider';
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
  } = watchUserInfoController((state) => ({
    userId: state.activeUser?._id,
  }));

  const options = watchAccountController((state) => _.orderBy(
    _.filter(state, (item) => {
      if (item.members?.some((itemMember) => itemMember.userId === userId)) return true;
      return false;
    }),
    (item) => {
      const activity = item.activities?.[userId];
      if (!activity?.lastView) return 0;
      return new Date(activity.lastView).getTime();
    },
    ['desc'],
  ).map((item) => ({
    value: item._id,
    label: `${item.name} ${item.icon || ''}`,
  })));

  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.private }),
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
      <AccountProvider providerId={providerId}>
        <ScrollView>
          <Stack space="$4">
            <TradeWatch />
            <TradeHeader />
            <NewOrder />
            <ListTrade />
          </Stack>
        </ScrollView>
      </AccountProvider>
    </Stack>
  );
}
