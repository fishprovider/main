import Box from '~ui/core/Box';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Divisions() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        Professional Divisions
      </Title>
      <Text fz="lg">
        We assemble exceptional professionals with expertise in
        trading, funding, engineering, marketing,
        and legal matters within the financial industry
      </Text>
      <Group position="center" pt="sm">
        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/copy-trade-1.jpeg"
              alt="copy-trade-1"
              radius="lg"
              fit="contain"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Title size="h4">Trading</Title>
          </Box>
        </Card>
        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/risk.png"
              alt="risk"
              radius="lg"
              fit="contain"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Title size="h4">Funding</Title>
          </Box>
        </Card>
        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/robot.png"
              alt="robot"
              radius="lg"
              fit="contain"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Title size="h4">Engineering</Title>
          </Box>
        </Card>
        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/social.jpg"
              alt="social"
              radius="lg"
              fit="contain"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Title size="h4">Marketing</Title>
          </Box>
        </Card>
        <Card withBorder radius="lg" shadow="sm">
          <Card.Section>
            <Image
              src="/icons/scale.png"
              alt="scale"
              radius="lg"
              fit="contain"
              width="100%"
              height={180}
              sx={{ maxWidth: 180 }}
            />
          </Card.Section>
          <Box ta="center" pt="sm">
            <Title size="h4">Legal</Title>
          </Box>
        </Card>
      </Group>

    </Stack>
  );
}

export default Divisions;
