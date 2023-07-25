import orderRemove from '@fishprovider/cross/dist/api/orders/remove';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import { Order } from '@fishprovider/utils/dist/types/Order.model';

import Button from '~ui/Button';
import Group from '~ui/Group';
import { useToast } from '~ui/ToastProvider';

interface Props {
  order: Order;
}

export default function CloseOrderModal({ order }: Props) {
  const toast = useToast();

  const { mutate: close, isLoading } = useMutate({
    mutationFn: orderRemove,
  });

  const onCloseOrder = async () => {
    close({ order }, {
      onSuccess: () => {
        toast.show('Done');
      },
      onError: (err: any) => {
        toast.show(err);
      },
    });
  };

  return (
    <Group>
      <Button theme={isLoading ? 'gray' : 'red'} onPress={onCloseOrder} disabled={isLoading}>
        Yes, close this order now
      </Button>
    </Group>
  );
}
