import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import { watchUserInfoController } from '~controllers/user.controller';
import { logout } from '~libs/auth';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Grid from '~ui/core/Grid';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import { setPreLoginPage } from '~utils/user';

import LoginWithEmailPassword from './LoginWithEmailPassword';
import LoginWithMagicLink from './LoginWithMagicLink';
import LoginWithOAuth from './LoginWithOAuth';
import ResetPassword from './ResetPassword';

function Login() {
  const router = useRouter();
  const { redirectUrl } = router.query as {
    redirectUrl?: string
  };

  const userId = watchUserInfoController((state) => state.activeUser?._id);

  if (redirectUrl) {
    setPreLoginPage(redirectUrl);
  }

  if (!userId) {
    return (
      <ContentSection>
        <Stack ta="center" py="xl" spacing="xl">
          <Title>Login</Title>
          <Grid gutter="xl">
            <Grid.Col xs={12} sm={6}>
              <LoginWithOAuth />
            </Grid.Col>
            <Grid.Col xs={12} sm={6}>
              <Stack spacing="xl">
                <LoginWithMagicLink />
                <LoginWithEmailPassword />
                <ResetPassword />
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </ContentSection>
    );
  }

  return (
    <ContentSection>
      <Stack ta="center" py="xl" align="center">
        <Title>Welcome to FishProvider!</Title>
        <Group>
          <Link href={Routes.home} variant="clean">
            <Button size="lg">Explore now</Button>
          </Link>
          <Button
            size="lg"
            color="red"
            onClick={logout}
          >
            Logout
          </Button>
        </Group>
      </Stack>
    </ContentSection>
  );
}

export default Login;
