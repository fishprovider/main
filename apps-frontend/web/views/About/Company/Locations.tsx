import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Locations() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        Locations
      </Title>
      <Group position="center">
        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/sydney.jpg"
              alt="Sydney"
              radius="lg"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Text>Sydney</Text>
            <Text>Australia</Text>
          </Box>
        </Card>

        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/hcm.jpg"
              alt="Ho Chi Minh"
              radius="lg"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Text>Ho Chi Minh</Text>
            <Text>Vietnam</Text>
          </Box>
        </Card>

        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/coming-soon.jpg"
              alt="Frankfurt"
              radius="lg"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Text>Frankfurt</Text>
            <Text>Germany</Text>
          </Box>
        </Card>

        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/coming-soon.jpg"
              alt="Oslo"
              radius="lg"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Text>Oslo</Text>
            <Text>Norway</Text>
          </Box>
        </Card>

        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/coming-soon.jpg"
              alt="Marina Bay"
              radius="lg"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Text>Marina Bay</Text>
            <Text>Singapore</Text>
          </Box>
        </Card>
      </Group>
    </Stack>
  );
}

export default Locations;
