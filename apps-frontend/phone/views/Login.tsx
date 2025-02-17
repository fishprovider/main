import { Platform } from 'react-native';

import LiveModeSwitch from '~components/LiveModeSwitch';
import { LoginMethods } from '~constants/user';
import { loginOAuth } from '~libs/auth';
import Button from '~ui/Button';
import H4 from '~ui/H4';
import Stack from '~ui/Stack';

export default function Login() {
  return (
    <Stack center>
      <H4>Login</H4>
      <Button onPress={() => loginOAuth(LoginMethods.google)}>
        Login with Google
      </Button>
      {Platform.OS === 'ios' && (
        <Button onPress={() => loginOAuth(LoginMethods.apple)}>
          Login with Apple
        </Button>
      )}
      <LiveModeSwitch />
    </Stack>
  );
}
