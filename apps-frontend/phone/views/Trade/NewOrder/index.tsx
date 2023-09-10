import { FontAwesome } from '@expo/vector-icons';

import Button from '~ui/Button';
import Group from '~ui/Group';
import { showModal } from '~ui/ModalProvider';
import OpenOrder from '~views/OpenOrder';

export default function NewOrder() {
  const onOpen = () => {
    showModal(<OpenOrder />);
  };

  return (
    <Group>
      <Button
        iconAfter={(
          <FontAwesome name="plus" size={15} style={{ color: 'deepskyblue' }} />
        )}
        borderColor="deepskyblue"
        onPress={onOpen}
      >
        New Order
      </Button>
    </Group>
  );
}
