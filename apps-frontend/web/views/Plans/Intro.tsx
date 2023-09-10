import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Intro() {
  return (
    <Stack py={50}>
      <Title ta="center">Our Plans</Title>
      <Title ta="center" size="h3">
        We provider flexible plans to a wide range of clients, whether they are individuals,
        companies, experienced investors, or those with zero experience in investing
      </Title>
      <Text ta="center">
        Our offerings empower you with full control over your investments and decisions.
        Moreover, we prioritize transparency, ensuring that you
        have complete visibility and clarity throughout the process
      </Text>
    </Stack>
  );
}

export default Intro;
