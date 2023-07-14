import { apiPost } from '@fishprovider/cross/dist/libs/api';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import React, { useState } from 'react';

import Button from '~ui/core/Button';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import { toastError, toastSuccess } from '~ui/toast';

function Reward() {
  const {
    roles,
  } = storeUser.useStore((state) => ({
    roles: state.info?.roles,
  }));
  const { isAdmin } = getRoleProvider(roles);

  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState(0);

  const onSubmit = () => {
    apiPost('/reward/add', { userId, amount })
      .then(() => toastSuccess('Done'))
      .catch((err) => toastError(`${err}`));
  };

  if (!isAdmin) return null;

  return (
    <Stack py="lg">
      <Title>❤️❤️❤️ Reward ❤️❤️❤️</Title>
      <TextInput
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        label="User ID"
      />
      <NumberInput
        value={amount}
        onChange={(value) => setAmount(+value)}
        label="Amount"
      />
      <Button onClick={onSubmit}>Submit</Button>
    </Stack>
  );
}

export default Reward;
