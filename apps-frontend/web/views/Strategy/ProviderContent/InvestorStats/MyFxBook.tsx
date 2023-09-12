import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';

import Link from '~components/base/Link';
import Card from '~ui/core/Card';
import Image from '~ui/core/Image';
import ThemeProvider from '~ui/themes/ThemeProvider';

function MyFxBook() {
  const myfxbookUrl = storeUser.useStore(
    (state) => state.activeProvider?.strategyLinks
      ?.find((item) => item.type === ProviderType.myfxbook)?.url,
  );

  if (!myfxbookUrl) return null;

  return (
    <Link href={myfxbookUrl} target="_blank">
      <ThemeProvider colorScheme="light">
        <Card withBorder p="xs" radius="md" shadow="xl">
          <Image
            src="/icons/myfxbook.png"
            alt="myfxbook"
            fit="contain"
            height={25}
          />
        </Card>
      </ThemeProvider>
    </Link>
  );
}

export default MyFxBook;
