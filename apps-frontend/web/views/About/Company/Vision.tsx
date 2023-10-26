import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Vision() {
  return (
    <Stack align="center">
      <Title size="h3">
        Vision, Mission & Core Values
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
          <Text span fw="bold">Core Values</Text>
          : Ethics - Determination - Intelligence
        </Text>
      </Stack>
    </Stack>
  );
}

export default Vision;
