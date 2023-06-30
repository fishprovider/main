import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Card from '~ui/core/Card';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Text from '~ui/core/Text';

function TradeCardNew() {
  return (
    <Link href={Routes.accountOpen} variant="clean">
      <Card withBorder>
        <Group position="center">
          <Icon name="Add" button size="large" />
          <Text>Open Account Now</Text>
        </Group>
      </Card>
    </Link>
  );
}

export default TradeCardNew;
