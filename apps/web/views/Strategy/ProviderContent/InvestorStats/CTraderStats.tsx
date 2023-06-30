import storeUser from '@fishbot/cross/stores/user';

import Link from '~components/base/Link';
import { ctraderPlatforms } from '~constants/account';
import Card from '~ui/core/Card';
import Image from '~ui/core/Image';
import ThemeProvider from '~ui/themes/ThemeProvider';

function CTraderStats() {
  const strategyId = storeUser.useStore((state) => state.activeProvider?.strategyId);

  if (!strategyId) return null;

  const platformId = 'icmarkets';
  const ctraderUrl = `${ctraderPlatforms[platformId]?.copyUrl}/${strategyId}`;

  return (
    <Link href={ctraderUrl} target="_blank">
      <ThemeProvider colorScheme="light">
        <Card withBorder p="xs" radius="md" shadow="xl">
          <Image
            src="/icons/ctrader.png"
            alt="ctrader"
            fit="contain"
            height={20}
          />
        </Card>
      </ThemeProvider>
    </Link>
  );
}

export default CTraderStats;
