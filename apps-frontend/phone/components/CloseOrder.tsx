import { FontAwesome } from '@expo/vector-icons';
import orderRemove from '@fishprovider/cross/dist/api/orders/remove';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import { Order } from '@fishprovider/utils/dist/types/Order.model';

import Alert from '~ui/Alert';
import { useToast } from '~ui/ToastProvider';

interface Props {
  order: Order;
}

export default function CloseOrder({ order }: Props) {
  const toast = useToast();

  const { mutate: close, isLoading } = useMutate({
    mutationFn: orderRemove,
  });

  const onClose = () => {
    Alert.alert('Are you sure?', `Close Order ${order.volume} ${order.symbol}`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => close({ order }, {
          onSuccess: () => {
            toast.show('Done');
          },
          onError: (err: any) => {
            toast.show(err);
          },
        }),
      },
    ]);
  };

  return (
    <FontAwesome
      name="window-close"
      color={isLoading ? 'grey' : 'orange'}
      size={20}
      onPress={onClose}
      disabled={isLoading}
    />
  );
}
