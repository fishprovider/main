import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { PlanType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getPriceFromAmount, getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import { useState } from 'react';

import PricePips from '~components/PricePips';
import SymbolsSelect from '~components/SymbolsSelect';
import VolumeLots from '~components/VolumeLots';
import useConversionRate from '~hooks/useConversionRate';
import Button from '~ui/Button';
import Group from '~ui/Group';
import Label from '~ui/Label';
import RadioGroup from '~ui/RadioGroup';
import Stack from '~ui/Stack';

export default function OpenOrder() {
  const {
    symbol,
    providerType = ProviderType.icmarkets,
    asset = 'USD',
    plan = [],
    balance = 0,
  } = storeUser.useStore((state) => ({
    symbol: state.activeSymbol,
    providerType: state.activeProvider?.providerType,
    asset: state.activeProvider?.asset,
    plan: state.activeProvider?.plan,
    balance: state.activeProvider?.balance,
  }));

  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);
  const rate = useConversionRate(symbol);

  const [orderType, setOrderType] = useState<OrderType>(OrderType.market);
  const [direction, setDirection] = useState<Direction>(Direction.buy);
  const [volumeInput, setVolumeInput] = useState<number | undefined>(0);
  const [limitPriceInput, setLimitPriceInput] = useState<number | string | undefined>();

  const getDefaultVolume = () => {
    if (!priceDoc) return 0;

    return getVolumeFromLot({
      providerType,
      symbol,
      prices: { [priceDoc._id]: priceDoc },
      lot: 0.01,
    }).volume || 0;
  };
  const volume = volumeInput ?? getDefaultVolume();

  const getDefaultLimitPrice = () => {
    if (!priceDoc || !volume) return '';

    const defaultAmt = Math.max(balance / 100, 10); // 1% of balance or $10
    const maxSLAmt = (plan.find((item) => item.type === PlanType.stopLoss)
      ?.value || -defaultAmt) as number;

    return Math.max(0, getPriceFromAmount({
      direction,
      volume,
      entry: priceDoc.last,
      assetAmt: (orderType === OrderType.limit ? maxSLAmt : -maxSLAmt) / 2,
      rate,
    }));
  };
  const limitPrice = limitPriceInput ?? getDefaultLimitPrice();

  const onOpen = () => {
    Logger.info(symbol, orderType, direction);
  };

  const renderOrderType = () => (
    <RadioGroup
      value={orderType}
      onValueChange={(value) => setOrderType(value as OrderType)}
      orientation="horizontal"
      space="$4"
      theme="blue"
    >
      <Group>
        <RadioGroup.Item value={OrderType.market} size="$6" id={OrderType.market}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor={OrderType.market}>Market</Label>
      </Group>
      <Group>
        <RadioGroup.Item value={OrderType.limit} size="$6" id={OrderType.limit}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor={OrderType.limit}>Limit</Label>
      </Group>
      <Group>
        <RadioGroup.Item value={OrderType.stop} size="$6" id={OrderType.stop}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor={OrderType.stop}>Stop</Label>
      </Group>
    </RadioGroup>
  );

  const renderPendingPrice = () => {
    if (!priceDoc) return null;

    if (orderType === OrderType.limit) {
      return (
        <PricePips
          label="Limit price"
          providerType={providerType}
          symbol={symbol}
          entry={priceDoc.last}
          newPrice={+limitPrice}
          onChange={setLimitPriceInput}
          asset={asset}
          rate={rate}
          direction={direction}
          volume={volume}
        />
      );
    }
    if (orderType === OrderType.stop) {
      return (
        <PricePips
          label="Stop price"
          providerType={providerType}
          symbol={symbol}
          entry={priceDoc.last}
          newPrice={+limitPrice}
          onChange={setLimitPriceInput}
          asset={asset}
          rate={rate}
          direction={direction}
          volume={volume}
        />
      );
    }

    return null;
  };

  const renderBuySell = () => (
    <Group>
      <Button
        flex={1}
        theme={direction === Direction.buy ? 'green' : 'transparent'}
        borderColor={direction === Direction.buy ? 'green' : 'lightgrey'}
        onPress={() => setDirection(Direction.buy)}
      >
        Buy
      </Button>
      <Button
        flex={1}
        theme={direction === Direction.sell ? 'red' : 'transparent'}
        borderColor={direction === Direction.sell ? 'red' : 'lightgrey'}
        onPress={() => setDirection(Direction.sell)}
      >
        Sell
      </Button>
    </Group>
  );

  return (
    <Stack space="$5" padding="$2">
      <SymbolsSelect />
      {renderOrderType()}
      <VolumeLots
        providerType={providerType}
        symbol={symbol}
        volume={volume}
        onChange={setVolumeInput}
      />
      {renderPendingPrice()}
      {renderBuySell()}
      <Button
        theme={direction === Direction.buy ? 'green' : 'red'}
        borderColor={direction === Direction.buy ? 'green' : 'red'}
        onPress={onOpen}
      >
        {_.upperFirst(direction)}
      </Button>
    </Stack>
  );
}
