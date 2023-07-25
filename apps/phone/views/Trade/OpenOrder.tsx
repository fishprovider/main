import { FontAwesome } from '@expo/vector-icons';

import Button from '~ui/Button';
import Group from '~ui/Group';

export default function OpenOrder() {
  return (
    <Group>
      <Button
        iconAfter={(
          <FontAwesome name="plus" size={15} style={{ color: 'green' }} />
      )}
        themeInverse
      >
        New Order
      </Button>
    </Group>
  );
}
