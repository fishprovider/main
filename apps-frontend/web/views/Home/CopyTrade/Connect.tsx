import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Connect() {
  return (
    <Stack>
      <Title ta="center" size="h2">Copy Trading Platforms</Title>
      <Text size="lg" ta="center">
        Those are online marketplaces connecting Traders and Investors -
        {' '}
        <Link href={Routes.copyTrade} variant="noColor">
          Learn more
        </Link>
      </Text>
      <Group position="center">
        <Image
          src="/icons/copy-trading-platforms.png"
          alt="copy-trading-platforms"
          radius="lg"
          fit="contain"
          width="100%"
          sx={{ maxWidth: 600 }}
        />
      </Group>
    </Stack>
  );
}

export default Connect;
