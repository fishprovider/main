import storeUser from '@fishprovider/cross/dist/stores/user';

import LiveModeSwitch from '~components/LiveModeSwitch';
import { logout } from '~libs/auth';
import Button from '~ui/Button';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

export default function User() {
  const {
    email,
  } = storeUser.useStore((state) => ({
    email: state.info?.email,
  }));

  return (
    <Stack center>
      <Text>{email}</Text>
      <Button onPress={logout}>Logout</Button>
      <Button onPress={logout}>Remove Account</Button>
      <LiveModeSwitch />
    </Stack>
  );
}
