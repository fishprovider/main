import lockAccount from '@fishprovider/cross/dist/api/accounts/lock/account';
import orderAdd from '@fishprovider/cross/dist/api/orders/add';
import orderRemove from '@fishprovider/cross/dist/api/orders/remove';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { LockType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import useConversionRate from '~hooks/useConversionRate';
import Button from '~ui/core/Button';
import Checkbox from '~ui/core/Checkbox';
import Group from '~ui/core/Group';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import { toastError, toastSuccess } from '~ui/toast';
import { getDefaultSLTP } from '~utils/price';

interface Props {
  order: Order;
  onClose?: () => void,
}

function CloseModal({
  order,
  onClose = () => undefined,
}: Props) {
  const rate = useConversionRate(order.symbol);

  const [openLimitOrder, setOpenLimitOrder] = useState(false);
  const [lock, setLock] = useState(false);
  const [lockHours, setLockHours] = useState<number | string>(1);

  const { mutate: close, isLoading } = useMutate({
    mutationFn: orderRemove,
  });

  const { mutate: open, isLoading: isLoadingOpen } = useMutate({
    mutationFn: orderAdd,
  });

  const { mutate: lockAcc, isLoading: isLoadingLock } = useMutate({
    mutationFn: lockAccount,
  });

  const {
    providerType, providerPlatform, providerId, symbol, direction, volume,
    price: entry = 0,
  } = order;

  const onOpen = async () => {
    const {
      balance = 0,
      plan = [],
    } = storeUser.getState().activeProvider || {};

    const {
      defaultSL, defaultTP, planSLAmt, planTPAmt,
    } = getDefaultSLTP(balance, plan, direction, volume, entry, rate);

    const newOrder = {
      providerId,
      providerType,
      providerPlatform,
      orderType: OrderType.limit,
      status: OrderStatus.idea,

      symbol,
      direction,
      volume,
      limitPrice: entry,
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

  const onLock = async () => {
    const user = storeUser.getState().info as User;

    const lockNew = {
      type: LockType.open,
      lockFrom: new Date(),
      lockUntil: moment().add(+lockHours, 'hours').toDate(),
      lockMessage: 'Short break after closing order',
      lockByUserId: user._id,
      lockByUserName: user.name,
    };
    await new Promise((resolve) => {
      lockAcc({ providerId: order.providerId, lock: lockNew }, {
        onSuccess: () => resolve(true),
        onError: (err) => {
          toastError(`${err}`);
          resolve(true);
        },
      });
    });
  };

  const onCloseOrder = async () => {
    close({ order }, {
      onSuccess: async () => {
        toastSuccess('Done');
        if (openLimitOrder) {
          await onOpen();
        }
        if (lock) {
          await onLock();
        }
        onClose();
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  const getCloseText = () => [
    'Close Order',
    ...(openLimitOrder ? ['Open Limit Order'] : []),
    ...(lock ? ['Lock for a break'] : []),
  ].join(' + ');

  return (
    <Stack>
      <Title size="h2">{`Close ${_.upperFirst(direction)} ${volume} ${symbol}?`}</Title>
      <Title size="h4">Actions after closing order (optional)</Title>
      <Checkbox
        checked={openLimitOrder}
        onChange={() => setOpenLimitOrder((prev) => !prev)}
        label={`Open a Limit Order at the Entry of this order at ${order.price}`}
      />
      <Group>
        <Checkbox
          checked={lock}
          onChange={() => setLock((prev) => !prev)}
          label="Lock for a break in"
        />
        <NumberInput
          value={lockHours}
          onChange={(value) => setLockHours(value)}
          rightSection="hours"
        />
      </Group>
      <Group position="right">
        <Button
          onClick={onCloseOrder}
          loading={isLoading || isLoadingOpen || isLoadingLock}
        >
          {getCloseText()}
        </Button>
        <Button onClick={onClose} variant="subtle">Cancel</Button>
      </Group>
    </Stack>
  );
}

export default CloseModal;
