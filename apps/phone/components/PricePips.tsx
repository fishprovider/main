import storePrices from '@fishprovider/cross/dist/stores/prices';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Direction } from '@fishprovider/utils/dist/constants/order';
import {
  getDiffPips, getGrossProfit, getPriceFromAmount,
} from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import Group from '~ui/Group';
import Input from '~ui/Input';
import Label from '~ui/Label';
import Stack from '~ui/Stack';

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
}

function PricePips({
  label, providerType, symbol, direction, volume, entry, newPrice,
  asset, rate, balance,
  onChange,
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
      <Stack space="$0" flex={1}>
        <Label htmlFor="price">{label}</Label>
        <Input
          id="price"
          value={String(price)}
          onChangeText={(value) => {
            setPriceInput(value);
            onChange(value);

            setPipsInput(value && getPips(value));
            setProfitInput(value && getProfit(value));
          }}
        />
      </Stack>
      {pipSize && (
        <Stack space="$0" flex={1}>
          <Label htmlFor="pips">{`${label} (Pips)`}</Label>
          <Input
            id="pips"
            value={String(pips)}
            onChangeText={(value) => {
              setPipsInput(value);

              const newPriceInput = _.round(
                entry + +value * pipSize,
                digits,
              );
              setPriceInput(newPriceInput);
              onChange(newPriceInput);

              setProfitInput(newPriceInput && getProfit(newPriceInput));
            }}
          />
        </Stack>
      )}
      {asset && (
        <Stack space="$0" flex={1}>
          <Label htmlFor="profit">{`${label} (${asset}) ${profitRatio ? `(${profitRatio}%)` : ''}`}</Label>
          <Input
            id="profit"
            value={String(profit)}
            onChangeText={(value) => {
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
          />
        </Stack>
      )}
    </Group>
  );
}

export default PricePips;
