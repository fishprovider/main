import orderAdd from '@fishprovider/cross/dist/api/orders/add';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import { useNavigation } from '@react-navigation/native';

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

  const onOpen = async (order: OrderWithoutId) => {
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
