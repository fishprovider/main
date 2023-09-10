import BorderRainbow from '~components/base/BorderRainbow';
import Link from '~components/base/Link';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

function Intro() {
  return (
    <Stack py={60}>
      <Group
        position="center"
        spacing={60}
        sx={(theme) => ({
          [theme.fn.smallerThan('lg')]: {
            gap: 50,
          },
          [theme.fn.smallerThan('md')]: {
            gap: 40,
          },
        })}
      >
        <Stack
          spacing="xl"
          maw={500}
          sx={(theme) => ({
            [theme.fn.smallerThan('lg')]: {
              maxWidth: 400,
            },
            [theme.fn.smallerThan('md')]: {
              maxWidth: 300,
            },
          })}
        >
          <Title>Follow Leader, Amplify Profit</Title>
          <Title size="h2">
            Everlasting and Stable Success with FishProvider Copy Trading Strategies
          </Title>
          <Title size="h3">
            Consistently generate profit at least 2% monthly
          </Title>
          <span>
            <Link href="#overview">
              <Button size="lg">Explore now ➜</Button>
            </Link>
          </span>
        </Stack>

        <BorderRainbow radius="10px" heightScale={2}>
          <Image
            src="/profit-chart.svg"
            alt="profit-chart"
            radius="10px"
            width="100%"
            sx={(theme) => ({
              maxWidth: 400,
              [theme.fn.smallerThan('lg')]: {
                maxWidth: 350,
              },
              [theme.fn.smallerThan('md')]: {
                maxWidth: 300,
              },
            })}
          />
        </BorderRainbow>
      </Group>
    </Stack>
  );
}

export default Intro;
