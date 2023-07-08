import signalGetMany from '@fishprovider/cross/api/signals/getMany';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';
import { ProviderType } from '@fishprovider/utils/constants/account';
import { useState } from 'react';

import { signalVersions } from '~constants/order';
import { queryKeys } from '~constants/query';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import SignalSymbol from './SignalSymbol';
import SignalTradingView from './SignalTradingView';

function Signals() {
  const {
    providerType = ProviderType.icmarkets,
    symbol,
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
    symbol: state.activeSymbol,
  }));

  const defaultSignalVersion = signalVersions[0] as typeof signalVersions[number];
  const [signalVersion, setSignalVersion] = useState(defaultSignalVersion.value);

  useQuery({
    queryFn: () => signalGetMany({ symbol }),
    queryKey: queryKeys.signals(providerType, symbol),
    refetchInterval: 1000 * 60 * 30, // 30m
  });

  return (
    <Stack>
      <Group>
        <Title size="h3">🚦 Signals</Title>
        <Select
          data={signalVersions.map((item) => ({
            value: item.value,
            label: item.value,
          }))}
          value={signalVersion}
          onChange={(value) => {
            if (!value) return;
            setSignalVersion(value);
          }}
          w={100}
        />
      </Group>
      <SignalSymbol
        symbol={symbol}
        signalVersion={
          signalVersions.find((item) => item.value === signalVersion) || defaultSignalVersion
        }
      />
      <SignalTradingView />
    </Stack>
  );
}

export default Signals;
