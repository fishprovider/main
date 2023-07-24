import storeUser from '@fishprovider/cross/dist/stores/user';

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
    <Stack space="$4" paddingTop="$4" alignItems="center">
      <Text>{email}</Text>
      <Button themeInverse onPress={logout}>Logout</Button>
      <Button themeInverse onPress={logout}>Remove Account</Button>
    </Stack>
  );
}
