import { AccountViewType } from '@fishprovider/core';
import { useState } from 'react';

import { AccountViewTypeText } from '~constants/account';
import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

import AccountEditor from './AccountEditor';

function AccountEdit() {
  const account = watchUserInfoController((state) => ({
    viewType: state.activeAccount?.viewType,
    name: state.activeAccount?.name,
    icon: state.activeAccount?.icon,
    strategyId: state.activeAccount?.strategyId,
  }));

  const [isEdit, setIsEdit] = useState(false);

  const {
    viewType, name, icon, strategyId,
  } = account;

  const renderToolbar = () => (isEdit ? (
    <Icon name="Close" button onClick={() => setIsEdit(false)} tooltip="Cancel" />
  ) : (
    <Icon name="Edit" button onClick={() => setIsEdit(true)} tooltip="Edit" />
  ));

  const renderView = () => (
    <>
      <Group>
        <Icon
          name={viewType === AccountViewType.private ? 'VisibilityOff' : 'Visibility'}
          tooltip={AccountViewTypeText[viewType || '']}
        />
        <Text>{AccountViewTypeText[viewType || '']}</Text>
      </Group>
      <Text>{`Name: ${name || ''}`}</Text>
      <Text>{`Icon: ${icon || ''}`}</Text>
      <Text>{`Strategy ID: ${strategyId || ''}`}</Text>
    </>
  );

  return (
    <Stack spacing="sm">
      <Group>
        <Title size="h4">✏️ Edit Account</Title>
        {renderToolbar()}
      </Group>
      {isEdit ? <AccountEditor account={account} onDone={() => setIsEdit(false)} /> : renderView()}
    </Stack>
  );
}

export default AccountEdit;
