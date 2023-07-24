import storeUser from '@fishprovider/cross/dist/stores/user';
import { useState } from 'react';

import { logout } from '~libs/auth';
import Button from '~ui/Button';
import Select from '~ui/Select';
import Stack from '~ui/Stack';
import Switch from '~ui/Switch';
import Text from '~ui/Text';

const options = [
  { value: 'demo', label: 'Demo' },
  { value: 'live', label: 'Live' },
];

export default function User() {
  const {
    email,
  } = storeUser.useStore((state) => ({
    email: state.info?.email,
  }));

  const [mode, setMode] = useState('live');

  return (
    <Stack space="$4" paddingTop="$4" alignItems="center">
      <Text>{email}</Text>
      <Button borderColor="black" onPress={logout}>Logout</Button>
      <Button borderColor="black" onPress={logout}>Remove Account</Button>
      <Switch borderColor="black">
        <Switch.Thumb />
      </Switch>
      <Select
        options={options}
        value={mode}
        onChange={setMode}
      >
        <Text>{options.find((item) => item.value === mode)?.label}</Text>
      </Select>
    </Stack>
  );
}
