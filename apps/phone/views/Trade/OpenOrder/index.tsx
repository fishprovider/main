import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Button from '~ui/Button';
import Group from '~ui/Group';

export default function OpenOrder() {
  const navigation = useNavigation<any>();

  const onOpen = () => {
    navigation.navigate('OpenOrder');
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
