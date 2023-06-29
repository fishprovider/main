import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

import DonateButton from './DonateButton';

function Links() {
  return (
    <Stack>
      <Title size="h2">Links</Title>
      <Group align="flex-start">
        <Stack>
          <Link href={Routes.support}>
            <Text>Support</Text>
          </Link>
          <Link href={Routes.security}>
            <Text>Security</Text>
          </Link>
        </Stack>
        <Stack>
          <Link href={Routes.privacy}>
            <Text>Privacy</Text>
          </Link>
          <Link href={Routes.status} target="_blank">
            <Text>Status</Text>
          </Link>
        </Stack>
      </Group>
      <DonateButton />
    </Stack>
  );
}

export default Links;
