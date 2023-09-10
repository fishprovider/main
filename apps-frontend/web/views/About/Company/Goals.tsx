import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Grid from '~ui/core/Grid';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Goals() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        Ultimate Goals
      </Title>
      <Grid>
        <Grid.Col sm={12} md={4}>
          <Stack align="center">
            <Image
              src="/icons/heart.jpg"
              alt="heart"
              radius="lg"
              width="100%"
              sx={{ maxWidth: 180 }}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col sm={12} md={8}>
          <Text fz="lg">
            We leverage our profits to establish and support non-profit organizations
          </Text>
          <Text fz="lg">
            - Orphan schools: we love kids 👶🍼🧸
          </Text>
          <Text fz="lg">
            - Elder centers: we care for ages 👴🏻👵🏻
          </Text>
          <Text fz="lg">
            - Green forests: we heal the Earth 🌎🍀
          </Text>
          <Text fz="lg">
            - And many others more
            {' '}
            <Link href={Routes.love} variant="noColor">here</Link>
            {' '}
            👨‍🦽💊
          </Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Goals;
