import orderUpdate from '@fishprovider/cross/dist/api/orders/update';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getEntry } from '@fishprovider/utils/dist/helpers/order';
import { validateOrderUpdate } from '@fishprovider/utils/dist/helpers/validateOrder';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';
import { useState } from 'react';

import PricePips from '~components/price/PricePips';
import VolumeLots from '~components/price/VolumeLots';
import useConversionRate from '~hooks/useConversionRate';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface Props {
  order: Order,
  onClose?: () => void,
}

export default function SettingsModal({
  order,
  onClose,
}: Props) {
  const {
    asset = 'USD',
    balance = 0,
  } = storeUser.useStore((state) => ({
    asset: state.activeProvider?.asset,
    balance: state.activeProvider?.balance,
  }));

  const priceDoc = storePrices.useStore((prices) => prices[`${order.providerType}-${order.symbol}`]);
  const rate = useConversionRate(order.symbol);

  const [stopLoss, setStopLoss] = useState<number | string>(order.stopLoss || '');
  const [takeProfit, setTakeProfit] = useState<number | string>(order.takeProfit || '');
  const [limitPrice, setLimitPrice] = useState<number | string>(order.limitPrice || '');
  const [stopPrice, setStopPrice] = useState<number | string>(order.stopPrice || '');
  const [volume, setVolume] = useState(order.volume);

  const options = {
    ...(stopLoss && { stopLoss: _.round(+stopLoss, priceDoc?.digits) }),
    ...(takeProfit && { takeProfit: _.round(+takeProfit, priceDoc?.digits) }),
    ...(limitPrice && { limitPrice: _.round(+limitPrice, priceDoc?.digits) }),
    ...(stopPrice && { stopPrice: _.round(+stopPrice, priceDoc?.digits) }),
    volume,
  };

  let entry = getEntry(order);
  if (order.orderType === OrderType.limit) {
    entry = options.limitPrice ?? order.limitPrice;
  } else if (order.orderType === OrderType.stop) {
    entry = options.stopPrice ?? order.stopPrice;
  }

  const { mutate: updateOrder, isLoading } = useMutate({
    mutationFn: orderUpdate,
  });

  const validate = () => {
    const {
      info: user,
      activeProvider: account,
    } = storeUser.getState() as {
      info: User,
      activeProvider: Account,
    };

    const liveOrders = _.filter(
      storeOrders.getState(),
      (item) => item.providerId === account._id && item.status === OrderStatus.live,
    );
    const pendingOrders = _.filter(
      storeOrders.getState(),
      (item) => item.providerId === account._id && item.status === OrderStatus.pending,
    );

    return validateOrderUpdate({
      user,
      account,
      liveOrders,
      pendingOrders,
      orderToUpdate: { ...order, ...options },
      prices: storePrices.getState(),
    });
  };

  const onSave = async () => {
    const { error } = validate();
    if (error) {
      toastError(error);
      return;
    }

    if (!(await openConfirmModal())) return;

    updateOrder({ order, options }, {
      onSuccess: () => {
        if (onClose) onClose();
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  const renderSLTP = () => {
    if (!entry) return null;

    return (
      <>
        <PricePips
          label="Stop Loss"
          providerType={order.providerType}
          symbol={order.symbol}
          entry={entry}
          newPrice={+stopLoss}
          onChange={setStopLoss}
          asset={asset}
          rate={rate}
          direction={order.direction}
          volume={volume}
          balance={balance}
        />
        <PricePips
          label="Take Profit"
          providerType={order.providerType}
          symbol={order.symbol}
          entry={entry}
          newPrice={+takeProfit}
          onChange={setTakeProfit}
          asset={asset}
          rate={rate}
          direction={order.direction}
          volume={volume}
          balance={balance}
        />
      </>
    );
  };

  const renderPendingPrice = () => {
    if (!priceDoc) return null;

    if (order.orderType === OrderType.limit) {
      return (
        <PricePips
          label="Limit price"
          providerType={order.providerType}
          symbol={order.symbol}
          entry={priceDoc.last}
          newPrice={+limitPrice}
          onChange={setLimitPrice}
          asset={asset}
          rate={rate}
          direction={order.direction}
          volume={volume}
          errorPrice={(val) => {
            if (!val) return 'Cannot be empty';
            if (+val <= 0) return 'Must be > 0';
            if (order.direction === Direction.buy && +val >= priceDoc.last) return `Must be < ${priceDoc.last}`;
            if (order.direction === Direction.sell && +val <= priceDoc.last) return `Must be > ${priceDoc.last}`;
            return undefined;
          }}
          errorPips={(val) => {
            if (!val) return 'Cannot be empty';
            if (order.direction === Direction.buy && +val >= 0) return 'Must be < 0';
            if (order.direction === Direction.sell && +val <= 0) return 'Must be > 0';
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
    if (order.orderType === OrderType.stop) {
      return (
        <PricePips
          label="Stop price"
          providerType={order.providerType}
          symbol={order.symbol}
          entry={priceDoc.last}
          newPrice={+stopPrice}
          onChange={setStopPrice}
          asset={asset}
          rate={rate}
          direction={order.direction}
          volume={volume}
          errorPrice={(val) => {
            if (!val) return 'Cannot be empty';
            if (+val <= 0) return 'Must be > 0';
            if (order.direction === Direction.buy && +val <= priceDoc.last) return `Must be > ${priceDoc.last}`;
            if (order.direction === Direction.sell && +val >= priceDoc.last) return `Must be < ${priceDoc.last}`;
            return undefined;
          }}
          errorPips={(val) => {
            if (!val) return 'Cannot be empty';
            if (order.direction === Direction.buy && +val <= 0) return 'Must be > 0';
            if (order.direction === Direction.sell && +val >= 0) return 'Must be < 0';
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

  const renderVolume = () => [OrderType.limit, OrderType.stop].includes(order.orderType) && (
    <VolumeLots
      providerType={order.providerType}
      symbol={order.symbol}
      volume={order.volume}
      onChange={setVolume}
    />
  );

  return (
    <Stack>
      {renderVolume()}
      {renderPendingPrice()}
      {renderSLTP()}
      <Group position="right">
        <Button onClick={onSave} loading={isLoading}>Save</Button>
        <Button onClick={onClose} variant="subtle">Close</Button>
      </Group>
    </Stack>
  );
}
