import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text/Text';
import Title from '~ui/core/Title';

function Intro() {
  return (
    <Stack pt="xl">
      <Title ta="center">Our Strategies</Title>
      <Text ta="center">
        Different investors have varying preferences and objectives.
        Hence, we offer a wide array of trading strategies,
        each with its own distinct profit targets and associated risk-reward profiles.
      </Text>
    </Stack>
  );
}

export default Intro;
