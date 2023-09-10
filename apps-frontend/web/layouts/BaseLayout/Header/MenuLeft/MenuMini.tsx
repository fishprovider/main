import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import { menuItems } from '~constants/menu';
import Routes from '~libs/routes';
import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Menu from '~ui/core/Menu';
import Text from '~ui/core/Text';

function MenuMini() {
  const router = useRouter();

  const renderDropdown = () => (
    <Menu
      items={menuItems.map((menuItem) => ({
        key: menuItem.key,
        content: (
          <Link href={menuItem.href} variant="clean">
            <span data-test-id={`navbar.${menuItem.key}`}>
              <Text size="lg">{menuItem.label}</Text>
            </span>
          </Link>
        ),
        onClick: () => router.push(menuItem.href),
      }))}
    >
      <span data-test-id="navbar.menu">
        <Icon name="List" button size="large" />
      </span>
    </Menu>
  );

  // const renderIcons = () => menuItems.map((menuItem) => (
  //   <Link key={menuItem.key} href={menuItem.href} variant="clean">
  //     <Icon name={menuItem.icon} button color="blue" tooltip={menuItem.label} />
  //   </Link>
  // ));

  return (
    <Group p={5} spacing="xs">
      <Link href={Routes.home} variant="clean">
        <Avatar src="/logo.png" alt="logo" size="sm" />
      </Link>
      {renderDropdown()}
    </Group>
  );
}

export default MenuMini;
