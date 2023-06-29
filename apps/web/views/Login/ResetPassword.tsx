import { useState } from 'react';

import { resetPassword } from '~libs/auth';
import Button from '~ui/core/Button';
import Card from '~ui/core/Card';
import Stack from '~ui/core/Stack';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import { toastError } from '~ui/toast';

function ResetPassword() {
  const [email, setEmail] = useState('');

  return (
    <Card withBorder radius="lg" shadow="xl">
      <Stack>
        <Title size="h4">Reset Password</Title>
        <TextInput
          label="Email"
          type="email"
          placeholder="email@gmail.com"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          onClick={() => {
            if (!email) {
              toastError('Email is required');
              return;
            }
            resetPassword(email);
          }}
        >
          Reset now
        </Button>
      </Stack>
    </Card>
  );
}

export default ResetPassword;
