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
    <Stack center>
      <Text>{email}</Text>
      <Button onPress={logout}>Logout</Button>
      <Button onPress={logout}>Remove Account</Button>
      <Switch>
        <Switch.Thumb />
      </Switch>
      <Stack>
        <Select
          options={options}
          value={mode}
          onChange={setMode}
        />
      </Stack>
    </Stack>
  );
}
