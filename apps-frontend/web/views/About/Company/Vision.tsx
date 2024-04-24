import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Vision() {
  return (
    <Stack align="center">
      <Title size="h3">
        Vision, Mission & Values
      </Title>
      <Stack>
        <Text fz="lg">
          <Text span fw="bold">Vision</Text>
          : Together we create the most value in the world
        </Text>
        <Text fz="lg">
          <Text span fw="bold">Mission</Text>
          : Investment products reach all countries in the world
        </Text>
        <Text fz="lg">
          <Text span fw="bold">Values</Text>
          <Stack>
            <Text>1. We think big do small</Text>
            <Text>2. We build plans to success</Text>
            <Text>3. We always control the hall</Text>
          </Stack>
        </Text>
      </Stack>
    </Stack>
  );
}

export default Vision;
