import storeUser from '@fishprovider/cross/stores/user';
import type { Investor } from '@fishprovider/utils/types/Account.model';
import _ from 'lodash';

import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function AccountInvestors() {
  const {
    investors = [],
  } = storeUser.useStore((state) => ({
    investors: state.activeProvider?.investors,
  }));

  if (!investors?.length) return null;

  const renderRow = (investor: Investor, rowIndex: number) => (
    <Table.Row key={rowIndex}>
      <Table.Cell>
        <Group>
          <Avatar src={investor.picture} alt={investor.name} />
          <Text>{(investor.name || '').split(' ').map((word) => `${word[0]}.`).join(' ')}</Text>
        </Group>
      </Table.Cell>
      <Table.Cell>{`${investor.percent}%`}</Table.Cell>
    </Table.Row>
  );

  return (
    <Stack>
      <Title size="h2">🤝 Investors</Title>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Share</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {_.orderBy(investors, ['percent'], ['desc']).map(renderRow)}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default AccountInvestors;
