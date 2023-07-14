import storeUser from '@fishprovider/cross/dist/stores/user';
import type { Member } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

import { ProviderRoleText } from '~constants/account';
import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function AccountMembers() {
  const {
    members = [],
    activities = {},
  } = storeUser.useStore((state) => ({
    members: state.activeProvider?.members,
    activities: state.activeProvider?.activities,
  }));

  const renderRow = (member: Member) => {
    const activity = activities[member.userId];
    return (
      <Table.Row key={member.userId}>
        <Table.Cell>
          <Group>
            <Avatar src={member.picture} alt={member.userId} />
            <Text>{(member.name || '').split(' ').map((word) => `${word[0]}.`).join(' ')}</Text>
          </Group>
        </Table.Cell>
        <Table.Cell>{ProviderRoleText[member.role]?.text}</Table.Cell>
        <Table.Cell>{activity && `Last seen ${moment(activity.lastView).fromNow()}`}</Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Stack>
      <Title size="h2">👥 Members</Title>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Role</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {_.sortBy(members, (item) => moment(item.createdAt)).map(renderRow)}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default AccountMembers;
