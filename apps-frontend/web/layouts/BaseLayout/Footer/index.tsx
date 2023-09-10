import GGTranslate from '~components/view/GGTranslate';
import Grid from '~ui/core/Grid';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import ContentSection from '~ui/layouts/ContentSection';

import Contacts from './Contacts';
// import LangSelector from './LangSelector';
import Links from './Links';
import PushNotificationButton from './PushNotificationButton';
import Reviews from './Reviews';
import StoreApps from './StoreApps';
import TimezoneSelector from './TimezoneSelector';

function Footer() {
  return (
    <ContentSection>
      <Stack py="xl" spacing="xl">
        <Grid gutter="xl">
          <Grid.Col xs={12} sm={10}>
            <Contacts />
          </Grid.Col>
          <Grid.Col xs={12} sm={2}>
            <Links />
          </Grid.Col>
        </Grid>

        <Group align="top" position="apart">
          <StoreApps />
          <Reviews />
        </Group>

        <Group spacing="xl">
          {/* <LangSelector /> */}
          <GGTranslate />
          <TimezoneSelector />
          <Text>© Copyright 2023 FishProvider | All rights reserved</Text>
        </Group>
      </Stack>
      <PushNotificationButton />
    </ContentSection>
  );
}

export default Footer;
