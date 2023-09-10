import Link from '~components/base/Link';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

function Support() {
  return (
    <ContentSection>
      <Stack py={50}>
        <Title>Support</Title>
        <Group spacing="xs">
          <Text size="lg">
            For any support, please submit a request in our
            {' '}
            #
            <Link href="https://discord.gg/G88a2bPQe8" target="_blank">
              support
            </Link>
            {' '}
            channel in
          </Text>
          <Link href="https://discord.gg/G88a2bPQe8" target="_blank">
            <Group spacing="xs">
              <Image
                src="/icons/discord.png"
                alt="discord"
                fit="contain"
                width="100%"
                sx={{ maxWidth: 30 }}
              />
              <Text size="lg">Discord</Text>
            </Group>
          </Link>
        </Group>
        <Text size="lg">
          Or email us at
          {' '}
          <Link href="mailto:admin@fishprovider.com" target="_blank">admin@fishprovider.com</Link>
        </Text>
      </Stack>
    </ContentSection>
  );
}

export default Support;
