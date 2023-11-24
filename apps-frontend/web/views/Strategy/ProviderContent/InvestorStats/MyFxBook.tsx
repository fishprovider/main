import { AccountType } from '@fishprovider/core';

import Link from '~components/base/Link';
import { watchUserInfoController } from '~controllers/user.controller';
import Card from '~ui/core/Card';
import Image from '~ui/core/Image';
import ThemeProvider from '~ui/themes/ThemeProvider';

function MyFxBook() {
  const myfxbookUrl = watchUserInfoController(
    (state) => state.activeAccount?.strategyLinks?.find((item) => item.type === AccountType.myfxbook)?.url,
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
