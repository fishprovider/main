import storePrices from '@fishprovider/cross/dist/stores/prices';
import { validateOrderRemove } from '@fishprovider/utils/dist/helpers/validateOrder';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import { getUserInfoController } from '~controllers/user.controller';
import Icon from '~ui/core/Icon';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';
import { toastError } from '~ui/toast';

import CloseModal from './CloseModal';

interface Props {
  order: Order;
}

function CloseOrder({ order }: Props) {
  const openCloseModal = () => openModal({
    title: <Title size="h4">Close Order</Title>,
    content: <CloseModal order={order} />,
  });

  const validateClose = () => {
    const {
      activeUser: user,
      activeAccount: account,
    } = getUserInfoController();

    return validateOrderRemove({
      user: user as any,
      account: account as any,
      orderToRemove: order,
      prices: storePrices.getState(),
    });
  };

  const onClose = async () => {
    const { error } = validateClose();
    if (error) {
      toastError(error);
      return;
    }

    openCloseModal();
  };

  return (
    <Icon
      name="Delete"
      size="small"
      button
      onClick={onClose}
      tooltip="Close order"
    />
  );
}

export default CloseOrder;
