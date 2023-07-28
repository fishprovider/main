import { FontAwesome } from '@expo/vector-icons';

import Button from '~ui/Button';
import Group from '~ui/Group';
import H6 from '~ui/H6';
import { useModalSimple } from '~ui/ModalProvider';

import OpenOrderModal from './OpenOrderModal';

export default function OpenOrder() {
  const [onOpen] = useModalSimple({
    title: <H6>New Order</H6>,
    content: <OpenOrderModal />,
  });

  return (
    <Group>
      <Button
        iconAfter={(
          <FontAwesome name="plus" size={15} style={{ color: 'green' }} />
        )}
        themeInverse
        onPress={onOpen}
      >
        New Order
      </Button>
    </Group>
  );
}
