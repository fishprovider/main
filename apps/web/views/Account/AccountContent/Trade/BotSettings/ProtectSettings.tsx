import accountUpdate from '@fishprovider/cross/dist/api/accounts/update';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import { useState } from 'react';

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
    providerId = '',
    roles,
    protectSettings = {},
    asset = 'USD',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    roles: state.info?.roles,
    protectSettings: state.activeProvider?.protectSettings,
    asset: state.activeProvider?.asset,
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

  const { isProtectorProvider } = getRoleProvider(roles, providerId);

  const onSave = async () => {
    if (enabledEquityLock) {
      if (!equityLock) {
        toastError('Invalid Equity, must be greater than 0');
        return;
      }
    }

    if (!(await openConfirmModal())) return;

    await accountUpdate({
      providerId,
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
