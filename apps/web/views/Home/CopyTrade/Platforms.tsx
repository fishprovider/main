import CopyPlatforms from '~components/view/CopyPlatforms';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Platforms() {
  return (
    <Stack>
      <Title ta="center" size="h2">Our Partners and Supported Platforms</Title>
      <Text size="lg" ta="center">
        CTrader and MetaTrader stand out as the prominent leaders
        in the field of Copy Trading platforms - We support all of them and even more
      </Text>
      <CopyPlatforms />
    </Stack>
  );
}

export default Platforms;
