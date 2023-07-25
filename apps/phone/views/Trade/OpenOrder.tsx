import { FontAwesome } from '@expo/vector-icons';

import Button from '~ui/Button';

export default function OpenOrder() {
  return (
    <Button
      iconAfter={(
        <FontAwesome name="plus" size={15} style={{ color: 'green' }} />
      )}
      themeInverse
    >
      New Order
    </Button>
  );
}
