import { useNavigation } from '@react-navigation/native';

import LiveModeSwitch from '~components/LiveModeSwitch';
import { watchUserInfoController } from '~controllers/user.controller';
import { logout } from '~libs/auth';
import Button from '~ui/Button';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

export default function User() {
  const navigation = useNavigation<any>();

  const {
    email,
  } = watchUserInfoController((state) => ({
    email: state.activeUser?.email,
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
