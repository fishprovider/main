import { AccountMember } from '@fishprovider/core';
import _ from 'lodash';
import moment from 'moment';

import { ProviderRoleText } from '~constants/account';
import { watchUserInfoController } from '~controllers/user.controller';
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
  } = watchUserInfoController((state) => ({
    members: state.activeAccount?.members,
    activities: state.activeAccount?.activities,
  }));

  const renderRow = (member: AccountMember) => {
    const activity = activities[member.userId || ''];
    return (
      <Table.Row key={member.email}>
        <Table.Cell>
          <Group>
            <Avatar src={member.picture} alt={member.email} />
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
