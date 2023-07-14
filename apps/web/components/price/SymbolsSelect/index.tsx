import priceGetDetail from '@fishprovider/cross/dist/api/prices/getDetail';
import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import priceGetNames from '@fishprovider/cross/dist/api/prices/getNames';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { PlanType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import { useEffect } from 'react';

import PriceView from '~components/price/PriceView';
import { queryKeys } from '~constants/query';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';

interface Props {
  hidePriceView?: boolean,
}

function SymbolsSelect({ hidePriceView }: Props) {
  const {
    symbol,
    providerType = ProviderType.icmarkets,
    plans = [],
  } = storeUser.useStore((state) => ({
    symbol: state.activeSymbol,
    providerType: state.activeProvider?.providerType,
    plans: state.activeProvider?.plan,
  }));

  const allSymbols = storePrices.useStore((state) => _.filter(
    state,
    (item) => item.providerType === providerType,
  ).map((item) => item.symbol));

  useQuery({
    queryFn: () => priceGetNames({ providerType }),
    queryKey: queryKeys.symbols(providerType),
  });

  useQuery({
    queryFn: () => priceGetMany({ providerType, symbols: [symbol], reload: true }),
    queryKey: queryKeys.prices(providerType, symbol),
  });

  useQuery({
    queryFn: () => priceGetDetail({ providerType, symbol }),
    queryKey: queryKeys.detail(providerType, symbol),
  });

  const symbolsPlan = (plans.find((plan) => (plan.type === PlanType.pairs))
    ?.value || []) as string[];
  const hasPlan = symbolsPlan.length > 0;
  const symbolDefault = hasPlan ? symbolsPlan[0] : symbol;
  const isInvalidSymbolDefault = hasPlan && !symbolsPlan.includes(symbol);

  useEffect(() => {
    if (isInvalidSymbolDefault) {
      storeUser.mergeState({ activeSymbol: symbolDefault });
    }
  }, [isInvalidSymbolDefault, symbolDefault]);

  const symbolsSelect = _.sortBy(_.uniq(
    hasPlan ? _.intersection(symbolsPlan, allSymbols) : allSymbols,
  ));

  return (
    <Group>
      <Select
        data={symbolsSelect}
        value={symbol}
        onChange={(value) => {
          if (!value) return;
          storeUser.mergeState({ activeSymbol: value });
        }}
        // searchable
      />
      {hidePriceView ? null : <PriceView />}
    </Group>
  );
}

export default SymbolsSelect;
