import storeUser from '@fishprovider/cross/stores/user';
import type { Member, MemberInvite } from '@fishprovider/utils/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

import { ProviderRoleText } from '~constants/account';
import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

import AddMember from './AddMember';
import LockMember from './LockMember';
import ReloadMembers from './ReloadMembers';
import RemoveMember from './RemoveMember';

function EditMembers() {
  const {
    members = [],
    memberInvites = [],
    activities = {},
  } = storeUser.useStore((state) => ({
    members: state.activeProvider?.members,
    memberInvites: state.activeProvider?.memberInvites,
    activities: state.activeProvider?.activities,
  }));

  const renderMember = (member: Member) => {
    const activity = activities[member.userId];
    return (
      <Table.Row key={member.userId}>
        <Table.Cell>
          <Group>
            <Avatar src={member.picture} alt={member.userId} />
            <Text>{member.name}</Text>
          </Group>
        </Table.Cell>
        <Table.Cell>{ProviderRoleText[member.role]?.text}</Table.Cell>
        <Table.Cell>{member.email}</Table.Cell>
        <Table.Cell>{activity && `Last seen ${moment(activity.lastView).fromNow()}`}</Table.Cell>
        <Table.Cell>
          <LockMember member={member} />
          <RemoveMember email={member.email} />
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderMemberInvite = (memberInvite: MemberInvite) => (
    <Table.Row key={memberInvite.email}>
      <Table.Cell />
      <Table.Cell>{ProviderRoleText[memberInvite.role]?.text}</Table.Cell>
      <Table.Cell>{memberInvite.email}</Table.Cell>
      <Table.Cell />
      <Table.Cell>
        <RemoveMember email={memberInvite.email} />
      </Table.Cell>
    </Table.Row>
  );

  return (
    <Stack>
      <Group>
        <Title size="h4">👥 Edit Members</Title>
        <AddMember />
        <ReloadMembers />
      </Group>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Role</Table.Header>
            <Table.Header>Email</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Action</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {_.sortBy(members, (item) => moment(item.createdAt)).map(renderMember)}
          {_.sortBy(memberInvites, (item) => moment(item.createdAt)).map(renderMemberInvite)}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default EditMembers;
