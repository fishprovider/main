import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Connect() {
  return (
    <Stack>
      <Title ta="center" size="h2">Copy Trading Platforms are online market places to connect Traders and Investors</Title>
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
      <Stack spacing={0}>
        <Text fz="lg">
          - Traders can turn their trading positions to public, make it as public strategies
          (think it as YouTube video creators)
        </Text>
        <Text fz="lg">
          - Investors can choose one or multiple trader&apos;s strategies to follow, then the
          platform will automatically copy positions of those strategies to investor&apos;s
          accounts
        </Text>
        <Text fz="lg">
          - Investors can start or stop following any strategy anytime, and get profit immediately
        </Text>
        <Text fz="lg">
          - Investors share profit with traders, and the platform will automatically
          take commission from investors&apos; profit to give to traders
        </Text>
      </Stack>
    </Stack>
  );
}

export default Connect;
