import Link from '~components/base/Link';
import Grid from '~ui/core/Grid';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Offer() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        We offer Copy Trading strategies
      </Title>
      <Grid>
        <Grid.Col sm={12} md={4}>
          <Stack align="center">
            <Image
              src="/icons/copy-trade-1.jpeg"
              alt="copy-trade-1"
              radius="lg"
              width="100%"
              sx={{ maxWidth: 180 }}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col sm={12} md={8}>
          <Stack>
            <Text fz="lg">
              All of our trading positions are
              {' '}
              <Text span c="blue" fw="bold">public</Text>
              {' '}
              in Copy Trading
              {' '}
              <Link href="#platforms" variant="noColor">platforms</Link>
              {' '}
              for anyone to copy and gain profit together with us. While everything
              is public, you have full control of your account and your money to
              decide when to invest and exit
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Offer;
