import orderAdd from '@fishprovider/cross/dist/api/orders/add';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { validateOrderAdd } from '@fishprovider/utils/dist/helpers/validateOrder';
import { Account } from '@fishprovider/utils/dist/types/Account.model';
import { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import { User } from '@fishprovider/utils/dist/types/User.model';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import OrderEditor from '~components/OrderEditor';
import Alert from '~ui/Alert';
import Stack from '~ui/Stack';
import { useToast } from '~ui/ToastProvider';

export default function OpenOrder() {
  const navigation = useNavigation<any>();
  const toast = useToast();

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
      toast.show(error);
      return;
    }

    Alert.alert('Are you sure?', `Open Order ${order.volume} ${order.symbol}`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => open({ order }, {
          onSuccess: () => {
            toast.show('Done');
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          },
          onError: (err: any) => {
            toast.show(err);
          },
        }),
      },
    ]);
  };

  return (
    <Stack padding="$2">
      <OrderEditor onSubmit={onOpen} loading={isLoading} />
    </Stack>
  );
}
