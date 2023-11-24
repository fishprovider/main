import Link from '~components/base/Link';
import { watchUserInfoController } from '~controllers/user.controller';
import Card from '~ui/core/Card';
import Image from '~ui/core/Image';
import ThemeProvider from '~ui/themes/ThemeProvider';

function CTraderStats() {
  const strategyId = watchUserInfoController((state) => state.activeAccount?.strategyId);

  if (!strategyId) return null;

  const ctraderUrl = `https://ct.spotware.com/copy/strategy/${strategyId}`;

  return (
    <Link href={ctraderUrl} target="_blank">
      <ThemeProvider colorScheme="light">
        <Card withBorder p="xs" radius="md" shadow="xl">
          <Image
            src="/icons/ctrader.png"
            alt="ctrader"
            fit="contain"
            height={25}
          />
        </Card>
      </ThemeProvider>
    </Link>
  );
}

export default CTraderStats;
