import _ from 'lodash';

import Link from '~components/base/Link';
import {
  ctraderPlatforms, metatraderPlatforms,
} from '~constants/account';
import Routes from '~libs/routes';
import type { CopyPlatform } from '~types/CopyPlatform.model';
import Card from '~ui/core/Card';
import Divider from '~ui/core/Divider';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ThemeProvider from '~ui/themes/ThemeProvider';

function CopyPlatforms() {
  const renderPlatformCard = (item: CopyPlatform) => (
    <Link key={item.name} href={item.partnerUrl || item.href} target="_blank" variant="noColor">
      <Stack align="center">
        <Image
          src={item.icon}
          alt={item.name}
          fit="contain"
          width={50}
          height={50}
        />
        {item.name}
      </Stack>
    </Link>
  );

  return (
    <Stack>
      <Group position="center" spacing="xl">
        <ThemeProvider colorScheme="light">
          <Card p="xl" radius="lg" shadow="xl">
            <Card.Section>
              <Stack align="center">
                <Link href="https://www.ctrader.com" target="_blank" variant="clean">
                  <Image
                    src="/icons/ctrader.png"
                    alt="ctrader"
                    radius="lg"
                    fit="contain"
                    height={50}
                    sx={{ padding: 5 }}
                  />
                </Link>
              </Stack>
              <Divider />
            </Card.Section>
            <Group position="center" pt="lg" spacing="xl">
              {_.map(ctraderPlatforms, renderPlatformCard)}
            </Group>
          </Card>
        </ThemeProvider>

        <ThemeProvider colorScheme="light">
          <Card p="xl" radius="lg" shadow="xl">
            <Card.Section>
              <Stack align="center">
                <Link href="https://www.metatrader4.com" target="_blank" variant="clean">
                  <Image
                    src="/icons/mt4-mt5.png"
                    alt="metatrader"
                    radius="lg"
                    fit="contain"
                    height={50}
                    sx={{ padding: 5 }}
                  />
                </Link>
              </Stack>
              <Divider />
            </Card.Section>
            <Group position="center" pt="lg" spacing="xl">
              {_.map(metatraderPlatforms, renderPlatformCard)}
            </Group>
          </Card>
        </ThemeProvider>

        <ThemeProvider colorScheme="light">
          <Card p="xl" radius="lg" shadow="xl">
            <Card.Section>
              <Group spacing="xs" p={5}>
                <Image
                  src="/logo-img-only.png"
                  alt="fish"
                  radius="lg"
                  fit="contain"
                  height={50}
                />
                <Title size="h4">FishPlatform</Title>
              </Group>
              <Divider />
            </Card.Section>
            <Group position="center" pt="lg" spacing="xl">
              <Link href={Routes.invest} variant="noColor">
                <Stack align="center">
                  <Image
                    src="/icons/fishct.png"
                    alt="FishCT"
                    fit="contain"
                    width={50}
                    height={50}
                  />
                  FishCT
                </Stack>
              </Link>
            </Group>
          </Card>
        </ThemeProvider>
      </Group>
    </Stack>
  );
}

export default CopyPlatforms;
