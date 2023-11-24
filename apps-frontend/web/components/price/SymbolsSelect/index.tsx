import { AccountPlanType, AccountType } from '@fishprovider/core';
import priceGetDetail from '@fishprovider/cross/dist/api/prices/getDetail';
import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import priceGetNames from '@fishprovider/cross/dist/api/prices/getNames';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import _ from 'lodash';
import { useEffect } from 'react';

import PriceView from '~components/price/PriceView';
import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';

interface Props {
  hidePriceView?: boolean,
}

function SymbolsSelect({ hidePriceView }: Props) {
  const {
    symbol = 'AUDUSD',
    accountType = AccountType.icmarkets,
    plans = [],
  } = watchUserInfoController((state) => ({
    symbol: state.activeSymbol,
    accountType: state.activeAccount?.accountType,
    plans: state.activeAccount?.plan,
  }));

  const allSymbols = storePrices.useStore((state) => _.filter(
    state,
    (item) => item.providerType === accountType as any,
  ).map((item) => item.symbol));

  useQuery({
    queryFn: () => priceGetNames({ providerType: accountType as any }),
    queryKey: queryKeys.symbols(accountType as any),
  });

  useQuery({
    queryFn: () => priceGetMany({ providerType: accountType as any, symbols: [symbol], reload: true }),
    queryKey: queryKeys.prices(accountType as any, symbol),
  });

  useQuery({
    queryFn: () => priceGetDetail({ providerType: accountType as any, symbol }),
    queryKey: queryKeys.detail(accountType as any, symbol),
  });

  const symbolsPlan = (plans.find((plan) => (plan.type === AccountPlanType.pairs))
    ?.value || []) as string[];
  const hasPlan = symbolsPlan.length > 0;
  const symbolDefault = hasPlan ? symbolsPlan[0] : symbol;
  const isInvalidSymbolDefault = hasPlan && !symbolsPlan.includes(symbol);

  useEffect(() => {
    if (isInvalidSymbolDefault) {
      updateUserInfoController({ activeSymbol: symbolDefault });
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
          updateUserInfoController({ activeSymbol: value });
        }}
        // searchable
      />
      {hidePriceView ? null : <PriceView />}
    </Group>
  );
}

export default SymbolsSelect;
