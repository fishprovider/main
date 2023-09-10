import dynamic from 'next/dynamic';

import Card from '~ui/core/Card';
import Grid from '~ui/core/Grid';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

const Offer = dynamic(() => import('./Offer'));
const ProfitHistory = dynamic(() => import('./ProfitHistory'));
const Welcome = dynamic(() => import('./Welcome'));

function Overview() {
  return (
    <Stack id="overview" py={50}>
      <ContentSection>
        <Stack pb="md">
          <Title ta="center" size="h2">
            Effortlessly boost your wealth accumulation
          </Title>
          <Title ta="center" size="h3">
            To individuals and companies with surplus funds, we offer a seamless
            opportunity to generate passive income and enhance your financial prosperity
          </Title>
        </Stack>
      </ContentSection>

      <Grid px="xs">
        <Grid.Col xs={12} sm={6} md={5}>
          <Stack>
            <Card withBorder radius="lg" shadow="xl">
              <Welcome />
            </Card>
            <Card withBorder radius="lg" shadow="xl">
              <Offer />
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col xs={12} sm={6} md={7}>
          <Card withBorder radius="lg" ta="center" shadow="xl">
            <ProfitHistory />
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Overview;
