import orderAdd from '@fishprovider/cross/api/orders/add';
import { useMutate } from '@fishprovider/cross/libs/query';
import storeOrders from '@fishprovider/cross/stores/orders';
import storePrices from '@fishprovider/cross/stores/prices';
import storeUser from '@fishprovider/cross/stores/user';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import { validateOrderAdd } from '@fishprovider/utils/helpers/validateOrder';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { OrderWithoutId } from '@fishprovider/utils/types/Order.model';
import type { User } from '@fishprovider/utils/types/User.model';
import _ from 'lodash';

import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

import OrderEditor from './OrderEditor';

interface Props {
  onClose?: () => void,
}

function OrderModal({ onClose }: Props) {
  const { mutate: open, isLoading } = useMutate({
    mutationFn: orderAdd,
  });

  const validate = (orderToNew: OrderWithoutId) => {
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

    return validateOrderAdd({
      user,
      account,
      liveOrders,
      pendingOrders,
      orderToNew,
      prices: storePrices.getState(),
    });
  };

  const onOpen = async (order: OrderWithoutId) => {
    const { error } = validate(order);
    if (error) {
      toastError(error);
      return;
    }

    const {
      orderType, direction, volume, symbol,
    } = order;

    if (!(await openConfirmModal({
      title: `${_.upperFirst(orderType)} ${_.upperFirst(direction)} ${volume} ${symbol}?`,
    }))) return;

    open({ order }, {
      onSuccess: () => {
        if (onClose) onClose();
      },
      onError: (err) => toastError(`${err}`),
    });
  };

  return (
    <Stack>
      <OrderEditor onSubmit={onOpen} loading={isLoading} />
      <Group position="right">
        <Button onClick={onClose} variant="subtle">Close</Button>
      </Group>
    </Stack>
  );
}

export default OrderModal;
