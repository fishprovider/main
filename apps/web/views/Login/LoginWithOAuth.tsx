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
  return (
    <Stack>
      <Box>
        <GoogleLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.google)}
          text="Login with Google"
        />
        <FacebookLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.facebook)}
          text="Login with Facebook"
        />
        <TwitterLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.twitter)}
          text="Login with Twitter"
        />
        <AppleLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.apple)}
          text="Login with Apple"
        />
        <MicrosoftLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.microsoft)}
          text="Login with Microsoft"
        />
        <YahooLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.yahoo)}
          text="Login with Yahoo"
        />
        <GithubLoginButton
          align="center"
          onClick={() => loginOAuth(LoginMethods.github)}
          text="Login with Github"
        />
      </Box>
    </Stack>
  );
}

export default LoginWithOAuth;
