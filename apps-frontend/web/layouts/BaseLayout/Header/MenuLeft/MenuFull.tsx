import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import { menuItems } from '~constants/menu';
import Routes from '~libs/routes';
// import { useTranslation } from '~libs/translation';
import Avatar from '~ui/core/Avatar';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';

function MenuFull() {
  const router = useRouter();
  // const { t } = useTranslation();

  return (
    <Group p={5} spacing={0}>
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
      {menuItems.map((item) => {
        const isSelect = item.href === Routes.home
          ? router.pathname === Routes.home
          : router.pathname.startsWith(item.href);
        return (
          <Link key={item.key} href={item.href} variant="clean">
            <Button
              variant={isSelect ? 'light' : 'subtle'}
              data-test-id={`navbar.${item.key}`}
            >
              {/* {t(`navbar.${item.key}`, item.label)} */}
              {item.label}
            </Button>
          </Link>
        );
      })}
    </Group>
  );
}

export default MenuFull;
