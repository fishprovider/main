import { FontAwesome } from '@expo/vector-icons';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { AccountPlatform, PlanType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getPriceFromAmount, getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import PricePips from '~components/PricePips';
import PriceView from '~components/PriceView';
import SymbolsSelect from '~components/SymbolsSelect';
import VolumeLots from '~components/VolumeLots';
import useConversionRate from '~hooks/useConversionRate';
import Button from '~ui/Button';
import Checkbox from '~ui/Checkbox';
import Group from '~ui/Group';
import RadioGroup from '~ui/RadioGroup';
import Stack from '~ui/Stack';
import { getDefaultSLTP } from '~utils/price';

interface Props {
  onSubmit: (order: OrderWithoutId) => void,
  loading?: boolean,
}

export default function OrderEditor({
  onSubmit, loading,
}: Props) {
  const {
    symbol,
    providerType = ProviderType.icmarkets,
    accountPlatform = AccountPlatform.ctrader,
    asset = 'USD',
    plan = [],
    balance = 0,
  } = storeUser.useStore((state) => ({
    symbol: state.activeSymbol,
    providerType: state.activeProvider?.providerType,
    accountPlatform: state.activeProvider?.accountPlatform,
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

  const [hasStopLoss, setHasStopLoss] = useState(false);
  const [stopLossInput, setStopLossInput] = useState<number | string>();
  const [hasTakeProfit, setHasTakeProfit] = useState(false);
  const [takeProfitInput, setTakeProfitInput] = useState<number | string>();

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

  let entry = priceDoc?.last || 0;
  if ([OrderType.limit, OrderType.stop].includes(orderType) && limitPrice) {
    entry = +limitPrice;
  }

  const {
    defaultSL, defaultTP, planSLAmt, planTPAmt,
  } = getDefaultSLTP(balance, plan, direction, volume, entry, rate);
  const stopLoss = stopLossInput ?? defaultSL;
  const takeProfit = takeProfitInput ?? defaultTP;

  const onOpen = () => {
    const providerId = storeUser.getState().activeProvider?._id || '';
    const digits = priceDoc?.digits || 0;

    const order = {
      providerId,
      providerType,
      accountPlatform,

      orderType,
      status: OrderStatus.idea,

      symbol,
      direction,
      volume,
      ...(orderType === OrderType.limit && limitPrice
        && { limitPrice: _.round(+limitPrice, digits) }),
      ...(orderType === OrderType.stop && limitPrice
        && { stopPrice: _.round(+limitPrice, digits) }),
      ...(orderType === OrderType.market
        && { price: entry }),
      ...((hasStopLoss || planSLAmt) && stopLoss
        && { stopLoss: _.round(+stopLoss, digits) }),
      ...((hasTakeProfit || planTPAmt) && takeProfit
        && { takeProfit: _.round(+takeProfit, digits) }),
    };

    onSubmit(order);
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

  const renderSLTPOption = () => (
    <Group space="$4">
      <Checkbox
        id="StopLoss"
        checked={hasStopLoss}
        onChange={() => setHasStopLoss((prev) => !prev)}
        label="Stop loss (SL)"
      />
      <Checkbox
        id="TakeProfit"
        checked={hasTakeProfit}
        onChange={() => setHasTakeProfit((prev) => !prev)}
        label="Take Profit (TP)"
      />
    </Group>
  );

  const renderSLTP = () => {
    if (!entry || !(hasStopLoss || hasTakeProfit)) return null;

    return (
      <Stack>
        {hasStopLoss && (
          <PricePips
            label="SL"
            providerType={providerType}
            symbol={symbol}
            entry={entry}
            newPrice={+stopLoss}
            onChange={setStopLossInput}
            asset={asset}
            rate={rate}
            direction={direction}
            volume={volume}
            balance={balance}
          />
        )}
        {hasTakeProfit && (
          <PricePips
            label="TP"
            providerType={providerType}
            symbol={symbol}
            entry={entry}
            newPrice={+takeProfit}
            onChange={setTakeProfitInput}
            asset={asset}
            rate={rate}
            direction={direction}
            volume={volume}
            balance={balance}
          />
        )}
      </Stack>
    );
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

  const getButtonColor = () => {
    if (loading) return 'grey';
    return direction === Direction.buy ? 'green' : 'red';
  };
  const buttonColor = getButtonColor();

  return (
    <Stack space="$5">
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
      {renderSLTPOption()}
      {renderSLTP()}
      {renderBuySell()}
      <Button
        theme={buttonColor}
        borderColor={buttonColor}
        icon={(
          <FontAwesome
            name={direction === Direction.buy ? 'arrow-up' : 'arrow-down'}
            color={buttonColor}
            size={20}
          />
        )}
        onPress={onOpen}
        disabled={loading}
      >
        {_.upperFirst(direction)}
      </Button>
    </Stack>
  );
}
