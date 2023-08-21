import MonthProfit from '~components/account/MonthProfit';
import Link from '~components/base/Link';
import { ctraderPlatforms } from '~constants/account';
import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import ThemeProvider from '~ui/themes/ThemeProvider';
import { isLive, isProd } from '~utils';

const providerId = isProd && isLive ? 'earth' : 'octopus';
const platformId = 'icmarkets';
const strategyId = '65916';
const ctraderUrl = `${ctraderPlatforms[platformId]?.copyUrl}/${strategyId}`;

const myFxBookId = 'earth/10192142';
const myFxBookUrl = `https://www.myfxbook.com/portfolio/${myFxBookId}`;

function ProfitHistory() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        Historical Profit Performance
      </Title>
      <Text fz="lg">
        This is the strategy named Earth 🍀 one of the top FishProvider
        {' '}
        <Link href="#strategies" variant="noColor">strategies</Link>
      </Text>
      <Box pt="lg">
        <MonthProfit providerId={providerId} />
      </Box>
      <Title ta="center" size="h4">
        Alternatively, you can also find the performance records on MyFxBook and CTrader
      </Title>
      <Group position="center">
        <Link href={myFxBookUrl} target="_blank">
          <ThemeProvider colorScheme="light">
            <Card withBorder p="sm" radius="md" shadow="sm">
              <Image
                src="/icons/myfxbook.png"
                alt="myfxbook"
                fit="contain"
                height={30}
              />
            </Card>
          </ThemeProvider>
        </Link>
        <Link href={ctraderUrl} target="_blank">
          <ThemeProvider colorScheme="light">
            <Card withBorder p="sm" radius="md" shadow="sm">
              <Image
                src="/icons/ctrader.png"
                alt="ctrader"
                fit="contain"
                height={30}
              />
            </Card>
          </ThemeProvider>
        </Link>
      </Group>
    </Stack>
  );
}

export default ProfitHistory;
