import storePrices from '@fishbot/cross/stores/prices';
import type { ProviderType } from '@fishbot/utils/constants/account';
import type { Direction } from '@fishbot/utils/constants/order';
import {
  getDiffPips, getGrossProfit, getPriceFromAmount,
} from '@fishbot/utils/helpers/price';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import Group from '~ui/core/Group';
import NumberInput from '~ui/core/NumberInput';

interface Props {
  label: string,
  providerType: ProviderType,
  symbol: string,
  entry: number,
  newPrice: number,
  onChange: (value: number | string) => void,
  asset: string,
  rate: number,
  direction: Direction,
  volume: number,
  balance?: number,
  errorPrice?: (value: number | string) => string | undefined,
  errorPips?: (value: number | string) => string | undefined,
  errorProfit?: (value: number | string) => string | undefined,
}

function PricePips({
  label, providerType, symbol, direction, volume, entry, newPrice,
  asset, rate, balance,
  onChange, errorPrice, errorPips, errorProfit,
}: Props) {
  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);
  const {
    digits = 5,
    pipSize = 0,
  } = priceDoc || {};

  const [priceInput, setPriceInput] = useState<number | string>();
  const [pipsInput, setPipsInput] = useState<number | string>();
  const [profitInput, setProfitInput] = useState<number | string>();

  useEffect(() => {
    setPriceInput(undefined);
    setPipsInput(undefined);
    setProfitInput(undefined);
  }, [symbol, direction, volume, entry]);

  if (!priceDoc) return null;

  const price = priceInput ?? _.round(newPrice, digits);

  const getPips = (newPriceInput: number | string) => _.round(getDiffPips({
    providerType,
    symbol,
    prices: { [priceDoc._id]: priceDoc },
    entry,
    price: +newPriceInput,
  }).pips || 0, 2);
  const pips = pipsInput ?? getPips(newPrice);

  const getProfit = (newPriceInput: number | string) => _.round(getGrossProfit({
    entry,
    direction,
    volume,
    price: {
      _id: `${providerType}-${symbol}`,
      last: +newPriceInput,
    },
    rate,
  }), 2);
  const profit = profitInput ?? getProfit(newPrice);
  const profitRatio = balance ? _.round((+profit * 100) / balance, 2) : 0;

  return (
    <Group>
      <NumberInput
        label={label}
        step={1 / 10 ** digits}
        value={price}
        onChange={(value) => {
          setPriceInput(value);
          onChange(value);

          setPipsInput(value && getPips(value));
          setProfitInput(value && getProfit(value));
        }}
        error={errorPrice?.(price)}
      />
      {pipSize && (
        <NumberInput
          label={`${label} (Pips)`}
          value={pips}
          onChange={(value) => {
            setPipsInput(value);

            const newPriceInput = _.round(
              entry + +value * pipSize,
              digits,
            );
            setPriceInput(newPriceInput);
            onChange(newPriceInput);

            setProfitInput(newPriceInput && getProfit(newPriceInput));
          }}
          error={errorPips?.(pips)}
        />
      )}
      {asset && (
        <NumberInput
          label={`${label} (${asset}) ${profitRatio ? `(${profitRatio}%)` : ''}`}
          value={profit}
          onChange={(value) => {
            setProfitInput(value);

            const newPriceInput = _.round(getPriceFromAmount({
              direction,
              volume,
              entry,
              assetAmt: +value,
              rate,
            }), digits);
            setPriceInput(newPriceInput);
            onChange(newPriceInput);

            setPipsInput(newPriceInput && getPips(newPriceInput));
          }}
          error={errorProfit?.(profit)}
        />
      )}
    </Group>
  );
}

export default PricePips;
