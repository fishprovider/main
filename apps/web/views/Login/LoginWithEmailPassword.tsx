import { useRouter } from 'next/router';
import { useState } from 'react';

import useToggle from '~hooks/useToggle';
import { loginWithPassword } from '~libs/auth';
import Button from '~ui/core/Button';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import PasswordInput from '~ui/core/PasswordInput';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import { toastError } from '~ui/toast';

function LoginWithEmail() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [isLogin, toggleLogin] = useToggle(true);

  return (
    <Card withBorder radius="lg" shadow="xl">
      <Stack>
        <Title size="h4">
          {`${isLogin ? 'Login' : 'Signup'} with Email/Password`}
        </Title>
        <TextInput
          label="Email"
          type="email"
          placeholder="email@gmail.com"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordInput
          label="Password"
          required
          placeholder="******"
          onChange={(event) => setPass(event.target.value)}
        />
        {!isLogin && (
        <PasswordInput
          label="Confirm Password"
          required
          placeholder="******"
          onChange={(event) => setPassConfirm(event.target.value)}
        />
        )}
        <Button
          onClick={() => {
            if (!email || !pass) {
              toastError('Email and Password are required');
              return;
            }
            if (!isLogin && pass !== passConfirm) {
              toastError('Password does not match');
              return;
            }
            loginWithPassword(email, pass, isLogin, router.push);
          }}
        >
          {isLogin ? 'Login' : 'Signup'}
        </Button>
        {isLogin ? (
          <Group>
            <Text>Not have account?</Text>
            <Button variant="subtle" onClick={() => toggleLogin()}>Signup</Button>
          </Group>
        ) : (
          <Group>
            <Text>Already had account?</Text>
            <Button variant="subtle" onClick={() => toggleLogin()}>Login</Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}

export default LoginWithEmail;
