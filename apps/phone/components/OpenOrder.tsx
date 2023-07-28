import { FontAwesome } from '@expo/vector-icons';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { PlanType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getPriceFromAmount, getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import { useState } from 'react';

import PricePips from '~components/PricePips';
import PriceView from '~components/PriceView';
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
  const [volumeInput, setVolumeInput] = useState<number | undefined>();
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
      options={[
        { value: OrderType.market, label: 'Market' },
        { value: OrderType.limit, label: 'Limit' },
        { value: OrderType.stop, label: 'Stop' },
      ]}
      value={orderType}
      onChange={(value) => setOrderType(value as OrderType)}
    />
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
        icon={<FontAwesome name="arrow-up" color="green" size={20} />}
        onPress={() => setDirection(Direction.buy)}
      >
        Buy
      </Button>
      <Button
        flex={1}
        theme={direction === Direction.sell ? 'red' : 'transparent'}
        borderColor={direction === Direction.sell ? 'red' : 'lightgrey'}
        icon={<FontAwesome name="arrow-down" color="red" size={20} />}
        onPress={() => setDirection(Direction.sell)}
      >
        Sell
      </Button>
    </Group>
  );

  return (
    <Stack space="$5" padding="$2">
      <SymbolsSelect />
      <PriceView />
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
        icon={(
          <FontAwesome
            name={direction === Direction.buy ? 'arrow-up' : 'arrow-down'}
            color={direction === Direction.buy ? 'green' : 'red'}
            size={20}
          />
        )}
        onPress={onOpen}
      >
        {_.upperFirst(direction)}
      </Button>
    </Stack>
  );
}
