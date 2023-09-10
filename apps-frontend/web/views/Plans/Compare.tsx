import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Grid from '~ui/core/Grid';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import useTablet from '~ui/styles/useTablet';
import ThemeProvider from '~ui/themes/ThemeProvider';

function Compare() {
  const isTablet = useTablet();

  const selfManaged = {
    header: (
      <>
        <Title ta="center" c="green" size="h2">Self-Managed</Title>
        <Text ta="center" c="green" fz="md">(for experienced investors)</Text>
      </>
    ),
    benefit: (
      <>
        <Text>- Full control of your account and money</Text>
        <Text>- Manage investment funds yourself</Text>
      </>
    ),
    yourSide: (
      <>
        <Text>
          1. Create account on your preferred Copy Trading
          {' '}
          <Link href={Routes.copyTrade} variant="noColor">platform</Link>
        </Text>
        <Text>2. Deposit to your account</Text>
        <Text>3. Choose FishProvider strategies to copy</Text>
        <Text>4. Get profit directly to your account</Text>
      </>
    ),
    ourSide: (
      <Text>
        Provide links to our
        {' '}
        <Link href={Routes.strategies} variant="noColor">strategies</Link>
        {' '}
        for you to copy
      </Text>
    ),
    commission: (
      <Text>30% on your profit</Text>
    ),
    support: (
      <Text>Free, 24/7</Text>
    ),
    action: (
      <Link href={Routes.strategies}>
        <Button color="green" size="md">Start now ➜</Button>
      </Link>
    ),
  };

  const fundManaged = {
    header: (
      <>
        <Title ta="center" c="blue" size="h2">Fund-Managed</Title>
        <Text ta="center" c="blue" fz="md">(for non-experienced investors)</Text>
      </>
    ),
    benefit: (
      <>
        <Text>- No need investment knowledge</Text>
        <Text>- No need management work</Text>
      </>
    ),
    yourSide: (
      <>
        <Text>1. Sign a contract with us</Text>
        <Text>2. Fund to FishProvider account</Text>
        <Text>3. Receive profit to your preferred method</Text>
      </>
    ),
    ourSide: (
      <Text>We trade and get profit for you</Text>
    ),
    commission: selfManaged.commission,
    support: selfManaged.support,
    action: (
      <Link href={Routes.support}>
        <Button color="blue" size="md">Contact us 👋</Button>
      </Link>
    ),
  };

  const renderStartingPlans = () => (
    <Table
      fontSize="lg"
      style={{ background: '#f2f3f6', borderRadius: 20 }}
      withColumnBorders
      highlightOnHover={false}
    >
      <Table.THead>
        <Table.Row>
          <Table.Header />
          <Table.Header style={{ padding: 20, background: '#e6fcf5', borderTopLeftRadius: 20 }}>
            {selfManaged.header}
          </Table.Header>
          <Table.Header style={{ padding: 20, background: '#e7f5ff', borderTopRightRadius: 20 }}>
            {fundManaged.header}
          </Table.Header>
        </Table.Row>
      </Table.THead>

      <Table.TBody>
        <Table.Row>
          <Table.Header style={{ padding: 20 }}>Benefits</Table.Header>
          <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
            {selfManaged.benefit}
          </Table.Cell>
          <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
            {fundManaged.benefit}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Header style={{ padding: 20 }}>Your side</Table.Header>
          <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
            {selfManaged.yourSide}
          </Table.Cell>
          <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
            {fundManaged.yourSide}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Header style={{ padding: 20 }}>
            FishProvider
            <br />
            (our side)
          </Table.Header>
          <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
            {selfManaged.ourSide}
          </Table.Cell>
          <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
            {fundManaged.ourSide}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Header style={{ padding: 20 }}>
            <Text>Commission</Text>
          </Table.Header>
          <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
            {selfManaged.commission}
          </Table.Cell>
          <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
            {fundManaged.commission}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Header style={{ padding: 20 }}>
            <Text>Support</Text>
          </Table.Header>
          <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
            {selfManaged.support}
          </Table.Cell>
          <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
            {fundManaged.support}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Header />
          <Table.Cell style={{ padding: 20, background: '#e6fcf5', borderBottomLeftRadius: 20 }}>
            {selfManaged.action}
          </Table.Cell>
          <Table.Cell style={{ padding: 20, background: '#e7f5ff', borderBottomRightRadius: 20 }}>
            {fundManaged.action}
          </Table.Cell>
        </Table.Row>
      </Table.TBody>
    </Table>
  );

  const renderStartingPlansSlim = () => (
    <Grid justify="center" gutter="xl">
      <Grid.Col xs={10}>
        <ThemeProvider colorScheme="light">
          <Table
            fontSize="md"
            ta="center"
            style={{ borderRadius: 20 }}
          >
            <Table.THead>
              <Table.Row>
                <Table.Header style={{
                  padding: 20, background: '#e6fcf5', borderTopLeftRadius: 20, borderTopRightRadius: 20,
                }}
                >
                  {selfManaged.header}
                </Table.Header>
              </Table.Row>
            </Table.THead>

            <Table.TBody>
              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
                  <Title size="h3">Benefits</Title>
                  {selfManaged.benefit}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
                  <Title size="h3">Your side</Title>
                  {selfManaged.yourSide}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
                  <Title size="h3">FishProvider (our side)</Title>
                  {selfManaged.ourSide}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
                  <Title size="h3">Commission</Title>
                  {selfManaged.commission}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e6fcf5' }}>
                  <Title size="h3">Support</Title>
                  {selfManaged.support}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{
                  padding: 20, background: '#e6fcf5', borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                }}
                >
                  {selfManaged.action}
                </Table.Cell>
              </Table.Row>
            </Table.TBody>
          </Table>
        </ThemeProvider>
      </Grid.Col>

      <Grid.Col xs={10}>
        <ThemeProvider colorScheme="light">
          <Table
            fontSize="md"
            ta="center"
            style={{ borderRadius: 20 }}
          >
            <Table.THead>
              <Table.Row>
                <Table.Header style={{
                  padding: 20, background: '#e7f5ff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
                }}
                >
                  {fundManaged.header}
                </Table.Header>
              </Table.Row>
            </Table.THead>

            <Table.TBody>
              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
                  <Title size="h3">Benefits</Title>
                  {fundManaged.benefit}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
                  <Title size="h3">Your side</Title>
                  {fundManaged.yourSide}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
                  <Title size="h3">FishProvider (our side)</Title>
                  {fundManaged.ourSide}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
                  <Title size="h3">Commission</Title>
                  {fundManaged.commission}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{ padding: 20, background: '#e7f5ff' }}>
                  <Title size="h3">Support</Title>
                  {fundManaged.support}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell style={{
                  padding: 20, background: '#e7f5ff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                }}
                >
                  {fundManaged.action}
                </Table.Cell>
              </Table.Row>
            </Table.TBody>
          </Table>
        </ThemeProvider>
      </Grid.Col>
    </Grid>
  );

  return (
    <Stack pb={50} px="md">
      <ThemeProvider colorScheme="light">
        {isTablet ? renderStartingPlansSlim() : renderStartingPlans()}
      </ThemeProvider>
    </Stack>
  );
}

export default Compare;
