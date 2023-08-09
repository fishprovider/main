import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UserNav() {
  const navigation = useNavigation<any>();
  return (
    <FontAwesome
      name="user-circle"
      size={20}
      style={{ marginRight: 15, color: 'deepskyblue' }}
      onPress={() => navigation.navigate('User')}
    />
  );
}
