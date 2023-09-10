import storeUser from '@fishprovider/cross/dist/stores/user';
import { useNavigation } from '@react-navigation/native';

import LiveModeSwitch from '~components/LiveModeSwitch';
import { logout } from '~libs/auth';
import Button from '~ui/Button';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

export default function User() {
  const navigation = useNavigation<any>();

  const {
    email,
  } = storeUser.useStore((state) => ({
    email: state.info?.email,
  }));

  const onLogout = () => {
    logout();

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    navigation.navigate('Strategies');
  };

  return (
    <Stack center>
      <Text>{email}</Text>
      <Button onPress={onLogout}>Logout</Button>
      <Button onPress={onLogout}>Remove Account</Button>
      <LiveModeSwitch />
    </Stack>
  );
}
