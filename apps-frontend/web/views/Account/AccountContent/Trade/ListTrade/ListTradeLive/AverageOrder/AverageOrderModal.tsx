import orderAdd from '@fishprovider/cross/dist/api/orders/add';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { getPriceFromAmount } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import { getUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import useConversionRate from '~hooks/useConversionRate';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';
import { getDefaultSLTP } from '~utils/price';

interface Props {
  order: Order;
  onClose?: () => void,
}

function AverageOrderModal({
  order,
  onClose = () => undefined,
}: Props) {
  const {
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    asset: state.activeAccount?.asset,
  }));

  const {
    providerType, accountPlatform, providerId, symbol, direction, volume,
    price: entry = 0,
  } = order;

  const rate = useConversionRate(order.symbol);

  const [amount, setAmount] = useState<number | string>(2);
  const [numOrders, setNumOrders] = useState<number | string>(5);

  const { mutate: open, isLoading } = useMutate({
    mutationFn: orderAdd,
  });

  const openOrder = async (limitPrice: number) => {
    const {
      balance = 0,
      plan = [],
    } = getUserInfoController().activeAccount || {};

    const {
      defaultSL, defaultTP, planSLAmt, planTPAmt,
    } = getDefaultSLTP(balance, plan, direction, volume, limitPrice, rate);

    const newOrder = {
      providerId,
      providerType,
      accountPlatform,

      orderType: OrderType.limit,
      status: OrderStatus.idea,

      symbol,
      direction,
      volume,
      limitPrice,
      ...(planSLAmt && { stopLoss: defaultSL }),
      ...(planTPAmt && { takeProfit: defaultTP }),
    };

    await new Promise((resolve) => {
      open({ order: newOrder }, {
        onSuccess: () => resolve(true),
        onError: (err) => {
          toastError(`${err}`);
          resolve(true);
        },
      });
    });
  };

  const onAverage = async () => {
    if (!(await openConfirmModal())) return;

    const {
      last = 0,
      digits = 0,
    } = storePrices.getState()[`${providerType}-${symbol}`] || {};

    const priceStart = direction === Direction.buy
      ? Math.min(entry, last) : Math.max(entry, last);

    for (let idx = 0; idx < +numOrders; idx += 1) {
      const assetAmt = -amount * (idx + 1);

      const newEntry = _.round(getPriceFromAmount({
        direction, volume, entry: priceStart, assetAmt, rate,
      }), digits);

      await openOrder(newEntry);
      toastSuccess(`Order #${idx + 1} opened`);
    }

    onClose();
  };

  return (
    <Stack>
      <NumberInput
        value={amount}
        onChange={(value) => setAmount(value)}
        rightSection={asset}
        label={`Amount ${asset} to the next averaging order`}
      />
      <NumberInput
        value={numOrders}
        onChange={(value) => setNumOrders(value)}
        rightSection="orders"
        label="Number of averaging orders to open"
      />
      <Group position="right">
        <Button onClick={onAverage} loading={isLoading}>Average</Button>
        <Button onClick={onClose} variant="subtle">Cancel</Button>
      </Group>
    </Stack>
  );
}

export default AverageOrderModal;
