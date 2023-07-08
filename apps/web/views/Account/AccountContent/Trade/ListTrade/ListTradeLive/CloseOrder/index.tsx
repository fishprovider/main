import storePrices from '@fishprovider/cross/stores/prices';
import storeUser from '@fishprovider/cross/stores/user';
import { validateOrderRemove } from '@fishprovider/utils/helpers/validateOrder';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { Order } from '@fishprovider/utils/types/Order.model';
import type { User } from '@fishprovider/utils/types/User.model';

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
      info: user,
      activeProvider: account,
    } = storeUser.getState() as {
      info: User,
      activeProvider: Account,
    };

    return validateOrderRemove({
      user,
      account,
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
