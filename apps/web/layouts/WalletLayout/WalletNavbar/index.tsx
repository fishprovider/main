import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import { walletMenuItems } from '~constants/menu';
import Box from '~ui/core/Box';
import Flex from '~ui/core/Flex';
import Icon from '~ui/core/Icon';
import Menu from '~ui/core/Menu';
import NavLink from '~ui/core/NavLink';
import Text from '~ui/core/Text';

interface Props {
  miniMenu?: boolean;
}

function WalletNavbar({ miniMenu }: Props) {
  const router = useRouter();

  if (miniMenu) {
    return (
      <Menu items={walletMenuItems.map((menuItem) => ({
        key: menuItem.key,
        content: (
          <Link href={menuItem.href} variant="clean">
            <Text size="lg">{menuItem.label}</Text>
          </Link>
        ),
        onClick: () => router.push(menuItem.href),
      }))}
      >
        <span>
          <Flex gap="xs" pt="xs">
            <Icon name="ListAlt" button size="large" />
            <Text size="lg">Wallet Menu</Text>
          </Flex>
        </span>
      </Menu>
    );
  }

  return (
    <Box w={200} pr="xs">
      {walletMenuItems.map((item) => (
        <NavLink
          key={item.key}
          label={item.label}
          active={router.pathname.startsWith(item.href)}
          variant="light"
          component="a"
          href={item.href}
          onClick={(event) => {
            event.preventDefault();
            router.push(item.href);
          }}
        />
      ))}
    </Box>
  );
}

export default WalletNavbar;
