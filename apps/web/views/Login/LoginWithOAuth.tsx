import { useRouter } from 'next/router';
import {
  AppleLoginButton,
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
  MicrosoftLoginButton,
  TwitterLoginButton,
  YahooLoginButton,
} from 'react-social-login-buttons';

import { LoginMethods } from '~constants/user';
import { loginOAuth } from '~libs/auth';
import Box from '~ui/core/Box';
import Stack from '~ui/core/Stack';

function LoginWithOAuth() {
  const router = useRouter();

  const login = (method: LoginMethods) => loginOAuth(method, router.push);

  return (
    <Stack>
      <Box>
        <GoogleLoginButton
          align="center"
          onClick={() => login(LoginMethods.google)}
          text="Login with Google"
        />
        <FacebookLoginButton
          align="center"
          onClick={() => login(LoginMethods.facebook)}
          text="Login with Facebook"
        />
        <TwitterLoginButton
          align="center"
          onClick={() => login(LoginMethods.twitter)}
          text="Login with Twitter"
        />
        <AppleLoginButton
          align="center"
          onClick={() => login(LoginMethods.apple)}
          text="Login with Apple"
        />
        <MicrosoftLoginButton
          align="center"
          onClick={() => login(LoginMethods.microsoft)}
          text="Login with Microsoft"
        />
        <YahooLoginButton
          align="center"
          onClick={() => login(LoginMethods.yahoo)}
          text="Login with Yahoo"
        />
        <GithubLoginButton
          align="center"
          onClick={() => login(LoginMethods.github)}
          text="Login with Github"
        />
      </Box>
    </Stack>
  );
}

export default LoginWithOAuth;
