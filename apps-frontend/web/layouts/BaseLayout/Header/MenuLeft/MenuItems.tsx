import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import { menuItems } from '~constants/menu';
import Routes from '~libs/routes';
import Avatar from '~ui/core/Avatar';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Menu from '~ui/core/Menu';
import Text from '~ui/core/Text';

interface Props {
  numMenuItems?: number;
  offset?: number;
}

function MenuItems({ numMenuItems = 0, offset = 0 }: Props) {
  const router = useRouter();

  const fullItems = menuItems.slice(offset, numMenuItems + offset);
  const dropdownItems = menuItems.slice(numMenuItems + offset);

  const isSelect = (menuRoute: string) => {
    if (menuRoute === Routes.home) {
      return router.pathname === Routes.home;
    }
    if (menuRoute === Routes.blog && router.pathname === Routes.allBlog) {
      return true;
    }
    if (menuRoute === Routes.news && router.pathname === Routes.allNews) {
      return true;
    }
    return router.pathname.startsWith(menuRoute);
  };

  const renderFullItems = () => fullItems.map((item) => (
    <Link key={item.key} href={item.href} variant="clean">
      <Button
        variant={isSelect(item.href) ? 'light' : 'subtle'}
        data-test-id={`navbar.${item.key}`}
      >
        {item.label}
      </Button>
    </Link>
  ));

  const renderDropdownItems = () => (dropdownItems.length ? (
    <Menu
      items={dropdownItems.map((menuItem) => ({
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
  ) : null);

  return (
    <Group p={5} spacing="xs">
      <Link href={Routes.home} variant="clean">
        <Avatar
          src="/logo.png"
          alt="logo"
          size="md"
          imageProps={{
            loading: 'eager',
          }}
        />
      </Link>
      {renderFullItems()}
      {renderDropdownItems()}
    </Group>
  );
}

export default MenuItems;
