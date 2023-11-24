import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import { ThemeTypeTexts } from '~constants/user';
import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import { logout } from '~libs/auth';
import Routes from '~libs/routes';
import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Loading from '~ui/core/Loading';
import Menu from '~ui/core/Menu';
import Text from '~ui/core/Text';

function UserMenu() {
  const router = useRouter();

  const {
    isClientLoggedIn, isServerLoggedIn, userPicture, themeType, roles,
  } = watchUserInfoController((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    isServerLoggedIn: state.isServerLoggedIn,
    userPicture: state.activeUser?.picture,
    roles: state.activeUser?.roles,
    themeType: state.theme,
  }));

  if (isClientLoggedIn === undefined) return <Loading inline />;

  const { isManagerWeb } = getRoleProvider(roles);

  const theme = themeType === 'dark' ? 'light' : 'dark';

  const menuItems = [
    {
      key: 'theme',
      content: (
        <Group spacing="sm">
          <Text size="lg">{ThemeTypeTexts[theme]}</Text>
        </Group>
      ),
      right: themeType === 'dark' ? <Icon name="Brightness7" /> : <Icon name="Brightness4" />,
      onClick: () => updateUserInfoController({ theme }),
    },
    ...(isManagerWeb ? [
      {
        key: 'admin',
        content: (
          <Link href={Routes.admin} variant="clean">
            <Text size="lg">Admin</Text>
          </Link>
        ),
        onClick: () => router.push(Routes.admin),
      },
    ] : []),
    ...(isServerLoggedIn ? [
      {
        key: 'user',
        content: (
          <Link href={Routes.user} variant="clean">
            <Text size="lg">User Settings</Text>
          </Link>
        ),
        onClick: () => router.push(Routes.user),
      },
      {
        key: 'logout',
        content: <Text size="lg">Logout</Text>,
        onClick: logout,
      },
    ] : [
      {
        key: 'login',
        content: (
          <Link href={`${Routes.login}?redirectUrl=${router.asPath}`} variant="clean">
            <Text size="lg">Login</Text>
          </Link>
        ),
        onClick: () => router.push(`${Routes.login}?redirectUrl=${router.asPath}`),
      },
    ]),
  ];

  return (
    <Menu items={menuItems}>
      <span>
        <Avatar
          src={userPicture}
          alt="avatar"
          imageProps={{
            loading: 'eager',
          }}
        />
      </span>
    </Menu>
  );
}

export default UserMenu;
