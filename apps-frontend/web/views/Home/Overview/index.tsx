import dynamic from 'next/dynamic';

import Card from '~ui/core/Card';
import Carousel from '~ui/core/Carousel';
import Grid from '~ui/core/Grid';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

const Offer = dynamic(() => import('./Offer'));
const ProfitHistory = dynamic(() => import('./ProfitHistory'));
const Welcome = dynamic(() => import('./Welcome'));

const topAccounts = [
  {
    providerId: 'earth',
    icon: '🍀',
    ctraderUrl: 'https://ct.spotware.com/copy/strategy/65916',
    myFxBookUrl: 'https://www.myfxbook.com/members/FishProvider/earth/10192142',
  },
  {
    providerId: 'water',
    icon: '🌊',
    ctraderUrl: 'https://ct.spotware.com/copy/strategy/65917',
    myFxBookUrl: 'https://www.myfxbook.com/members/FishProvider/water/10406062',
  },
  {
    providerId: 'air',
    icon: '🌪️',
    ctraderUrl: 'https://ct.spotware.com/copy/strategy/65937',
    myFxBookUrl: 'https://www.myfxbook.com/members/FishProvider/air/10406063',
  },
  {
    providerId: 'fire',
    icon: '🔥',
    ctraderUrl: 'https://ct.spotware.com/copy/strategy/65938',
    myFxBookUrl: 'https://www.myfxbook.com/members/FishProvider/fire/10406064',
  },
  // {
  //   providerId: 'whale',
  //   ctraderUrl: '',
  //   myFxBookUrl: '',
  // },
  // {
  //   providerId: 'shark',
  //   ctraderUrl: '',
  //   myFxBookUrl: '',
  // },
];

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
            <Carousel
              slides={topAccounts.map((item) => <ProfitHistory key={item.providerId} {...item} />)}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Overview;
