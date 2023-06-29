import Link from '~components/base/Link';
import Grid from '~ui/core/Grid';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Welcome() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        Welcome to FishProvider
      </Title>
      <Grid>
        <Grid.Col sm={12} md={4}>
          <Stack align="center">
            <Image
              src="/icons/overview.jpg"
              alt="overview"
              radius="lg"
              width="100%"
              sx={{ maxWidth: 180 }}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col sm={12} md={8}>
          <Text fz="lg">
            We are earning
            {' '}
            <Text span c="green" fw="bold">consistent profit</Text>
            {' '}
            by trading in Foreign Exchange market (
            <Link href="https://en.wikipedia.org/wiki/Foreign_exchange_market" target="_blank" variant="noColor">Forex</Link>
            ) on our system using automatic and effective
            {' '}
            <Link href="#strategies" variant="noColor">strategies</Link>
            {' '}
            built from market analysis, indicators, price actions, economic theories,
            sentiment insights and many other advanced tools
          </Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Welcome;
