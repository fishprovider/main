import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { AccountPlatform, PlanType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getPriceFromAmount, getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import type { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import BuySellIcon from '~components/order/BuySellIcon';
import PricePips from '~components/price/PricePips';
import SymbolsSelect from '~components/price/SymbolsSelect';
import VolumeLots from '~components/price/VolumeLots';
import useConversionRate from '~hooks/useConversionRate';
import { getSessionKey, sessionWrite } from '~libs/cache';
import Button from '~ui/core/Button';
import Checkbox from '~ui/core/Checkbox';
import Group from '~ui/core/Group';
import Radio from '~ui/core/Radio';
import Stack from '~ui/core/Stack';
import { getDefaultSLTP } from '~utils/price';

interface Props {
  onSubmit: (order: OrderWithoutId) => void,
  loading?: boolean,
}

function OrderEditor({
  onSubmit, loading,
}: Props) {
  const {
    providerType = ProviderType.icmarkets,
    accountPlatform = AccountPlatform.ctrader,
    asset = 'USD',
    plan = [],
    balance = 0,
    symbol,
    orderLast,
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
    accountPlatform: state.activeProvider?.accountPlatform,
    asset: state.activeProvider?.asset,
    plan: state.activeProvider?.plan,
    balance: state.activeProvider?.balance,
    symbol: state.activeSymbol,
    orderLast: state[getSessionKey('orderLast')] as OrderWithoutId | undefined,
  }));

  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);
  const rate = useConversionRate(symbol);

  const [orderType, setOrderType] = useState<OrderType>(orderLast?.orderType || OrderType.market);
  const [direction, setDirection] = useState<Direction>(orderLast?.direction || Direction.buy);

  const [volumeInput, setVolumeInput] = useState<number | undefined>(
    orderLast?.symbol === symbol ? orderLast.volume : 0,
  );

  const getOrderLastLimitPrice = () => {
    if (orderLast?.symbol === symbol) {
      if (orderLast?.orderType === OrderType.limit) return orderLast?.limitPrice;
      if (orderLast?.orderType === OrderType.stop) return orderLast?.stopPrice;
    }
    return undefined;
  };
  const [limitPriceInput, setLimitPriceInput] = useState<number | string | undefined>(
    getOrderLastLimitPrice(),
  );

  const [hasStopLoss, setHasStopLoss] = useState(false);
  const [stopLossInput, setStopLossInput] = useState<number | string>();
  const [hasTakeProfit, setHasTakeProfit] = useState(false);
  const [takeProfitInput, setTakeProfitInput] = useState<number | string>();

  useEffect(() => {
    if (symbol === orderLast?.symbol) return;
    setVolumeInput(undefined);
    setLimitPriceInput(undefined);
    setStopLossInput(undefined);
    setTakeProfitInput(undefined);
  }, [symbol, orderLast]);

  useEffect(() => {
    if (orderType === orderLast?.orderType) return;
    setLimitPriceInput(undefined);
    setStopLossInput(undefined);
    setTakeProfitInput(undefined);
  }, [orderType, orderLast]);

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
  } = getDefaultSLTP(balance, plan as any, direction, volume, entry, rate);
  const stopLoss = stopLossInput ?? defaultSL;
  const takeProfit = takeProfitInput ?? defaultTP;

  const onOpen = async () => {
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

    sessionWrite('orderLast', order);
    onSubmit(order);
  };

  const renderBuySell = () => (
    <Group grow>
      <Button
        variant={direction === Direction.buy ? 'filled' : 'outline'}
        color={direction === Direction.buy ? 'green.4' : 'primary'}
        onClick={() => setDirection(Direction.buy)}
      >
        <Group spacing="sm">
          <BuySellIcon direction={Direction.buy} />
          Buy
        </Group>
      </Button>
      <Button
        variant={direction === Direction.sell ? 'filled' : 'outline'}
        color={direction === Direction.sell ? 'red.4' : 'primary'}
        onClick={() => setDirection(Direction.sell)}
      >
        <Group spacing="sm">
          <BuySellIcon direction={Direction.sell} />
          Sell
        </Group>
      </Button>
    </Group>
  );

  const renderOrderType = () => (
    <Group>
      <Radio
        checked={orderType === OrderType.market}
        onChange={() => setOrderType(OrderType.market)}
        label="Market Order"
      />
      <Radio
        checked={orderType === OrderType.limit}
        onChange={() => setOrderType(OrderType.limit)}
        label="Limit Order"
      />
      <Radio
        checked={orderType === OrderType.stop}
        onChange={() => setOrderType(OrderType.stop)}
        label="Stop Order"
      />
    </Group>
  );

  const renderVolumeLots = () => (
    <VolumeLots
      providerType={providerType}
      symbol={symbol}
      volume={volume}
      onChange={setVolumeInput}
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
          errorPrice={(val) => {
            if (!val) return 'Cannot be empty';
            if (+val <= 0) return 'Must be > 0';
            if (direction === Direction.buy && +val >= priceDoc.last) return `Must be < ${priceDoc.last}`;
            if (direction === Direction.sell && +val <= priceDoc.last) return `Must be > ${priceDoc.last}`;
            return undefined;
          }}
          errorPips={(val) => {
            if (!val) return 'Cannot be empty';
            if (direction === Direction.buy && +val >= 0) return 'Must be < 0';
            if (direction === Direction.sell && +val <= 0) return 'Must be > 0';
            return undefined;
          }}
          errorProfit={(val) => {
            if (!val) return 'Cannot be empty';
            if (+val >= 0) return 'Must be < 0';
            return undefined;
          }}
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
          errorPrice={(val) => {
            if (!val) return 'Cannot be empty';
            if (+val <= 0) return 'Must be > 0';
            if (direction === Direction.buy && +val <= priceDoc.last) return `Must be > ${priceDoc.last}`;
            if (direction === Direction.sell && +val >= priceDoc.last) return `Must be < ${priceDoc.last}`;
            return undefined;
          }}
          errorPips={(val) => {
            if (!val) return 'Cannot be empty';
            if (direction === Direction.buy && +val <= 0) return 'Must be > 0';
            if (direction === Direction.sell && +val >= 0) return 'Must be < 0';
            return undefined;
          }}
          errorProfit={(val) => {
            if (!val) return 'Cannot be empty';
            if (+val <= 0) return 'Must be > 0';
            return undefined;
          }}
        />
      );
    }

    return null;
  };

  const renderSLTPOption = () => (
    <Group>
      <Checkbox
        checked={hasStopLoss}
        onChange={() => setHasStopLoss((prev) => !prev)}
        label="Stop loss"
      />
      <Checkbox
        checked={hasTakeProfit}
        onChange={() => setHasTakeProfit((prev) => !prev)}
        label="Take Profit"
      />
    </Group>
  );

  const renderSLTP = () => {
    if (!entry || !(hasStopLoss || hasTakeProfit)) return null;

    return (
      <Stack>
        {hasStopLoss && (
          <PricePips
            label="Stop Loss"
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
            errorPrice={(val) => {
              if (!val) return 'Cannot be empty';
              if (+val <= 0) return 'Must be > 0';
              if (direction === Direction.buy && +val >= entry) return `Must be < ${entry}`;
              if (direction === Direction.sell && +val <= entry) return `Must be > ${entry}`;
              return undefined;
            }}
            errorPips={(val) => {
              if (!val) return 'Cannot be empty';
              if (direction === Direction.buy && +val >= 0) return 'Must be < 0';
              if (direction === Direction.sell && +val <= 0) return 'Must be > 0';
              return undefined;
            }}
            errorProfit={(val) => {
              if (!val) return 'Cannot be empty';
              if (+val >= 0) return 'Must be < 0';
              return undefined;
            }}
          />
        )}
        {hasTakeProfit && (
          <PricePips
            label="Take Profit"
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
            errorPrice={(val) => {
              if (!val) return 'Cannot be empty';
              if (+val <= 0) return 'Must be > 0';
              if (direction === Direction.buy && +val <= entry) return `Must be > ${entry}`;
              if (direction === Direction.sell && +val >= entry) return `Must be < ${entry}`;
              return undefined;
            }}
            errorPips={(val) => {
              if (!val) return 'Cannot be empty';
              if (direction === Direction.buy && +val <= 0) return 'Must be > 0';
              if (direction === Direction.sell && +val >= 0) return 'Must be < 0';
              return undefined;
            }}
            errorProfit={(val) => {
              if (!val) return 'Cannot be empty';
              if (+val <= 0) return 'Must be > 0';
              return undefined;
            }}
          />
        )}
      </Stack>
    );
  };

  return (
    <Stack>
      <SymbolsSelect />
      {renderOrderType()}
      {renderVolumeLots()}
      {renderPendingPrice()}
      {renderSLTPOption()}
      {renderSLTP()}
      {renderBuySell()}
      <Button
        onClick={onOpen}
        loading={loading}
        color={direction === Direction.buy ? 'green.4' : 'red.4'}
      >
        <Group>
          <BuySellIcon direction={direction} />
          {`${_.upperFirst(orderType)} ${_.upperFirst(direction)} ${volume} ${symbol}`}
        </Group>
      </Button>
    </Stack>
  );
}

export default OrderEditor;
