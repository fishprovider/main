import dynamic from 'next/dynamic';

import Card from '~ui/core/Card';
import Grid from '~ui/core/Grid';
import Stack from '~ui/core/Stack';

const Story = dynamic(() => import('./Story'));
const Goals = dynamic(() => import('./Goals'));
const Divisions = dynamic(() => import('./Divisions'));
const Locations = dynamic(() => import('./Locations'));

function Company() {
  return (
    <Stack pb={50} px="xs">
      <Grid>
        <Grid.Col xs={12} sm={6}>
          <Stack>
            <Card withBorder radius="lg" shadow="xl">
              <Story />
            </Card>
            <Card withBorder radius="lg" shadow="xl">
              <Divisions />
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col xs={12} sm={6}>
          <Stack>
            <Card withBorder radius="lg" shadow="xl">
              <Goals />
            </Card>
            <Card withBorder radius="lg" shadow="xl">
              <Locations />
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Company;
