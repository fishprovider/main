import { ProviderType } from '@fishprovider/core';
import signalGetMany from '@fishprovider/cross/dist/api/signals/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import { useState } from 'react';

import { signalVersions } from '~constants/order';
import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import SignalSymbol from './SignalSymbol';
import SignalTradingView from './SignalTradingView';

function Signals() {
  const {
    providerType = ProviderType.icmarkets,
    symbol = 'AUDUSD',
  } = watchUserInfoController((state) => ({
    providerType: state.activeAccount?.providerType,
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
