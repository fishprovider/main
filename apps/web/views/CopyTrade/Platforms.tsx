import Link from '~components/base/Link';
import CopyPlatforms from '~components/view/CopyPlatforms';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Platforms() {
  return (
    <Stack>
      <Title ta="center" size="h2">We support these Copy Trading Platforms now</Title>

      <CopyPlatforms />

      <Stack spacing={0}>
        <Text fz="lg">
          - These are all top, trustworthy, and legal platforms in the world, you can open
          account on any of them based on your location with your preferred currency
        </Text>
        <Text fz="lg">
          - We are working to support more platforms from this list
          {' '}
          <Link href="https://www.mrforex.com" variant="noColor" target="_blank">here</Link>
        </Text>
      </Stack>
    </Stack>
  );
}

export default Platforms;
