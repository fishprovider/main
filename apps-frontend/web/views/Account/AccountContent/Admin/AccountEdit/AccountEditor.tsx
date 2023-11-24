import storeUser from '@fishprovider/cross/dist/stores/user';
import { AccountViewType } from '@fishprovider/utils/dist/constants/account';
import { useState } from 'react';

import Link from '~components/base/Link';
import { AccountViewTypeText } from '~constants/account';
import { updateAccountController } from '~controllers/account.controller';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import NumberInput from '~ui/core/NumberInput';
import Radio from '~ui/core/Radio';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';

interface Props {
  account: {
    accountViewType?: AccountViewType;
    name?: string;
    icon?: string;
    providerGroupId?: string;
    strategyId?: string;
    minInvest?: number;
  },
  onDone: () => void,
}

function AccountEditor({ account, onDone } : Props) {
  const [accountViewType, setAccountViewType] = useState(account.accountViewType);
  const [name, setName] = useState(account.name || '');
  const [icon, setIcon] = useState(account.icon || '');
  const [strategyId, setStrategyId] = useState(account.strategyId || '');
  const [providerGroupId, setProviderGroupId] = useState(account.providerGroupId || '');
  const [minInvest, setMinInvest] = useState(account.minInvest || 0);

  const onSave = () => {
    const accountId = storeUser.getState().activeProvider?._id || '';

    updateAccountController({
      accountId,
    }, {
      accountViewType,
      name,
      icon,
      strategyId,
    }).finally(() => {
      onDone();
    });
  };

  return (
    <>
      <Group>
        <Radio
          checked={accountViewType === AccountViewType.private}
          onChange={() => setAccountViewType(AccountViewType.private)}
          label={AccountViewTypeText[AccountViewType.private]}
        />
        <Radio
          checked={accountViewType === AccountViewType.public}
          onChange={() => setAccountViewType(AccountViewType.public)}
          label={AccountViewTypeText[AccountViewType.public]}
        />
      </Group>
      <TextInput
        value={name}
        onChange={(event) => setName(event.target.value)}
        description="Only letters, numbers, and spaces in between"
        label="Name"
      />
      <TextInput
        value={icon}
        onChange={(event) => setIcon(event.target.value)}
        label="Icon"
        description={(
          <Text>
            Choose a pet from
            {' '}
            <Link href="https://emojiterra.com/animals" variant="noColor" target="_blank">
              https://emojiterra.com/animals
            </Link>
          </Text>
        )}
      />
      <TextInput
        value={providerGroupId}
        onChange={(event) => setProviderGroupId(event.target.value)}
        label="Provider Group ID"
      />
      <TextInput
        value={strategyId}
        onChange={(event) => setStrategyId(event.target.value)}
        label="Strategy ID"
      />
      <NumberInput
        value={minInvest}
        onChange={(value) => setMinInvest(+value)}
        label="Min Investment"
      />
      <Button onClick={onSave}>Save</Button>
    </>
  );
}

export default AccountEditor;
