import accountGet from '@fishprovider/cross/dist/api/accounts/get';
import _ from 'lodash';
import { useEffect } from 'react';

import MonthProfit from '~components/account/MonthProfit';
import Link from '~components/base/Link';
import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import ThemeProvider from '~ui/themes/ThemeProvider';

interface Props {
  providerId: string;
  icon: string;
  ctraderUrl: string;
  myFxBookUrl: string;
}

function ProfitHistory({
  providerId, icon, ctraderUrl, myFxBookUrl,
}: Props) {
  useEffect(() => {
    accountGet({ providerId });
  }, [providerId]);

  return (
    <Stack>
      <Title ta="center" size="h3">
        Historical Profit Performance
      </Title>
      <Text fz="lg">
        {`This is the strategy named ${_.upperFirst(providerId)} ${icon}, one of the top FishProvider `}
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
