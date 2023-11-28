import { getRoleProvider } from '@fishprovider/core';
import { useState } from 'react';

import { updateAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
import useToggle from '~hooks/useToggle';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Checkbox from '~ui/core/Checkbox';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface Props {
  onClose?: () => void;
}

function ProtectSettings({ onClose }: Props) {
  const {
    accountId = '',
    roles,
    protectSettings = {},
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    accountId: state.activeAccount?._id,
    roles: state.activeUser?.roles,
    protectSettings: state.activeAccount?.protectSettings,
    asset: state.activeAccount?.asset,
  }));

  const [enabledEquityLock, toggleEnabledEquityLock] = useToggle(
    protectSettings.enabledEquityLock || false,
  );
  const [equityLock, setEquityLock] = useState<number | string>(
    protectSettings.equityLock || 0,
  );
  const [equityLockHours, setEquityLockHours] = useState<number | string>(
    protectSettings.equityLockHours || 2,
  );

  const { isProtectorProvider } = getRoleProvider(roles, accountId);

  const onSave = async () => {
    if (enabledEquityLock) {
      if (!equityLock) {
        toastError('Invalid Equity, must be greater than 0');
        return;
      }
    }

    if (!(await openConfirmModal())) return;

    await updateAccountController({
      accountId,
    }, {
      protectSettings: {
        ...protectSettings,

        enabledEquityLock,
        ...(equityLock && { equityLock: +equityLock }),
        ...(equityLockHours && { equityLockHours: +equityLockHours }),
      },
    }).then(() => {
      if (onClose) onClose();
    });
  };

  const renderEL = () => (
    <Box>
      <Checkbox
        checked={enabledEquityLock}
        onChange={() => toggleEnabledEquityLock()}
        label={(
          <Group>
            Equity Lock (EL)
            <Icon name="HelpOutline" size="small" tooltip="Auto close all orders and lock account when Equity goes down to this" />
          </Group>
        )}
      />
      {enabledEquityLock && (
        <>
          <NumberInput
            value={equityLock}
            onChange={(value) => setEquityLock(value)}
            rightSection={asset}
          />
          <NumberInput
            value={equityLockHours}
            onChange={(value) => setEquityLockHours(value)}
            rightSection="hours"
          />
        </>
      )}
    </Box>
  );

  return (
    <Stack
      style={{
        ...(!isProtectorProvider && {
          pointerEvents: 'none',
          opacity: 0.5,
        }),
      }}
    >
      <Title size="h6">Protector Zone</Title>
      {renderEL()}
      {isProtectorProvider && <Button onClick={onSave}>Save Protector Settings</Button>}
    </Stack>
  );
}

export default ProtectSettings;
