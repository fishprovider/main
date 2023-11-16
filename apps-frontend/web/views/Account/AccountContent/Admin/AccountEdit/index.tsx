import storeUser from '@fishprovider/cross/dist/stores/user';
import { AccountViewType } from '@fishprovider/utils/dist/constants/account';
import { useState } from 'react';

import { ProviderViewTypeText } from '~constants/account';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

import AccountEditor from './AccountEditor';

function AccountEdit() {
  const account = storeUser.useStore((state) => ({
    accountViewType: state.activeProvider?.accountViewType,
    name: state.activeProvider?.name,
    icon: state.activeProvider?.icon,
    providerGroupId: state.activeProvider?.providerGroupId,
    strategyId: state.activeProvider?.strategyId,
  }));

  const [isEdit, setIsEdit] = useState(false);

  const {
    accountViewType, name, icon, strategyId,
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
          name={accountViewType === AccountViewType.private ? 'VisibilityOff' : 'Visibility'}
          tooltip={ProviderViewTypeText[accountViewType as AccountViewType]}
        />
        <Text>{ProviderViewTypeText[accountViewType as AccountViewType]}</Text>
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
