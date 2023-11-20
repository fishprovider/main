import { AccountCopySettings, AccountSettings } from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { CopyVolumeMode } from '@fishprovider/utils/dist/constants/account';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { CopySettings } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import { useState } from 'react';

import { CopyVolumeModeText } from '~constants/account';
import useToggle from '~hooks/useToggle';
import { updateAccountService } from '~services/account/updateAccount.service';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Checkbox from '~ui/core/Checkbox';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import NumberInput from '~ui/core/NumberInput';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import Switch from '~ui/core/Switch';
import Tabs from '~ui/core/Tabs';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface ParentCopySettingsProps {
  parentId: string;
  copySettings: CopySettings;
  isAdminProvider?: boolean;
  onClose?: () => void;
}

function ParentCopySettings({
  parentId, copySettings, isAdminProvider, onClose,
}: ParentCopySettingsProps) {
  const {
    accountId = '',
    settings = {},
  } = storeUser.useStore((state) => ({
    accountId: state.activeProvider?._id,
    settings: state.activeProvider?.settings,
  }));

  const {
    parentName,
  } = storeAccounts.useStore((state) => ({
    parentName: state[parentId]?.name,
  }));

  const [enableCopy, toggleEnableCopy] = useToggle(
    copySettings.enableCopy,
  );
  const [enableCopyOrderClose, toggleEnableCopyOrderClose] = useToggle(
    copySettings.enableCopyOrderClose,
  );
  const [enableCopyOrderSLTP, toggleEnableCopyOrderSLTP] = useToggle(
    copySettings.enableCopyOrderSLTP,
  );
  const [enabledEquitySL, toggleEnabledEquitySL] = useToggle(
    copySettings.enabledEquitySL,
  );
  const [equitySLRatio, setEquitySLRatio] = useState<number | string>(
    copySettings.equitySLRatio || '',
  );

  const [copyVolumeMode, setCopyVolumeMode] = useState(
    copySettings.copyVolumeMode,
  );
  const [copyVolumeRatioFixed, setCopyVolumeRatioFixed] = useState<number | string>(
    copySettings.copyVolumeRatioFixed || '',
  );
  const [copyVolumeLotFixed, setCopyVolumeLotFixed] = useState<number | string>(
    copySettings.copyVolumeLotFixed || '',
  );
  const [copyVolumeRatioAuto, setCopyVolumeRatioAuto] = useState<number | string>(
    copySettings.copyVolumeRatioAuto || '',
  );
  const [copyVolumeLotMin, setCopyVolumeLotMin] = useState<number | string>(
    copySettings.copyVolumeLotMin || '',
  );
  const [copyVolumeLotMax, setCopyVolumeLotMax] = useState<number | string>(
    copySettings.copyVolumeLotMax || '',
  );

  const onSave = async () => {
    if (enableCopy) {
      if (enabledEquitySL) {
        if (!equitySLRatio || +equitySLRatio < 0 || +equitySLRatio > 100) {
          toastError('Invalid Equity/Balance Ratio, must be between 0 and 100');
          return;
        }
      }
    }

    if (!(await openConfirmModal())) return;

    await updateAccountService({
      accountId,
    }, {
      settings: {
        ...settings,
        parents: {
          ...settings.parents,
          [parentId]: {
            enableCopy,
            enableCopyOrderClose,
            enableCopyOrderSLTP,

            copyVolumeMode,
            ...(copyVolumeRatioFixed && { copyVolumeRatioFixed: +copyVolumeRatioFixed }),
            ...(copyVolumeLotFixed && { copyVolumeLotFixed: +copyVolumeLotFixed }),
            ...(copyVolumeRatioAuto && { copyVolumeRatioAuto: +copyVolumeRatioAuto }),
            ...(copyVolumeLotMin && { copyVolumeLotMin: +copyVolumeLotMin }),
            ...(copyVolumeLotMax && { copyVolumeLotMax: +copyVolumeLotMax }),

            enabledEquitySL,
            ...(equitySLRatio && { equitySLRatio: +equitySLRatio }),
          },
        } as Record<string, AccountCopySettings>,
      },
    }).then(() => {
      if (onClose) onClose();
    });
  };

  const renderCopyOrderMode = () => (
    <>
      <Switch
        label={`Enable Copy ${parentName}`}
        checked={enableCopy}
        onChange={() => toggleEnableCopy()}
      />
      <Switch
        label="Copy Order Close (CP-Close)"
        checked={enableCopyOrderClose}
        onChange={() => toggleEnableCopyOrderClose()}
      />
      <Switch
        label="Copy Order SL/TP (CP-SLTP)"
        checked={enableCopyOrderSLTP}
        onChange={() => toggleEnableCopyOrderSLTP()}
      />
    </>
  );

  const renderEquitySL = () => (
    <>
      <Switch
        checked={enabledEquitySL}
        onChange={() => toggleEnabledEquitySL()}
        label={(
          <Group>
            <Box>Equity SL (CP-ESL)</Box>
            <Icon name="HelpOutline" size="small" tooltip="Auto stop copy parents when Equity/Balance down to this percentage" />
          </Group>
            )}
      />
      {enabledEquitySL && (
        <Group>
          Equity/Balance =
          <NumberInput
            value={equitySLRatio}
            onChange={(value) => setEquitySLRatio(value)}
            rightSection="%"
          />
        </Group>
      )}
    </>
  );

  const renderCopyVolumeMode = () => (
    <>
      <Group>
        Copy Volume Mode
        <Icon name="HelpOutline" size="small" tooltip={CopyVolumeModeText[copyVolumeMode || CopyVolumeMode.auto]?.description} />
        <Select
          data={Object.keys(CopyVolumeMode).map((item) => ({
            value: item,
            label: CopyVolumeModeText[item]?.text,
          }))}
          value={copyVolumeMode}
          onChange={(value) => {
            if (!value) return;
            setCopyVolumeMode(value as CopyVolumeMode);
          }}
        />
      </Group>
      {copyVolumeMode === CopyVolumeMode.fixedRatio && (
        <Group>
          Fixed Ratio
          <NumberInput
            value={copyVolumeRatioFixed}
            onChange={(value) => setCopyVolumeRatioFixed(value)}
          />
        </Group>
      )}
      {copyVolumeMode === CopyVolumeMode.fixedLot && (
        <Group>
          Fixed Lot
          <NumberInput
            value={copyVolumeLotFixed}
            onChange={(value) => setCopyVolumeLotFixed(value)}
            rightSection="Lot"
          />
        </Group>
      )}
      {copyVolumeMode === CopyVolumeMode.autoWithRatio && (
        <Group>
          Auto with Ratio
          <NumberInput
            value={copyVolumeRatioAuto}
            onChange={(value) => setCopyVolumeRatioAuto(value)}
          />
        </Group>
      )}
      {copyVolumeMode !== CopyVolumeMode.fixedLot && (
        <>
          <Group>
            Min Lot
            <NumberInput
              value={copyVolumeLotMin}
              onChange={(value) => setCopyVolumeLotMin(value)}
              placeholder="0.01"
              rightSection="Lot"
            />
          </Group>
          <Group>
            Max Lot
            <NumberInput
              value={copyVolumeLotMax}
              onChange={(value) => setCopyVolumeLotMax(value)}
              placeholder="100"
              rightSection="Lot"
            />
          </Group>
        </>
      )}
    </>
  );

  return (
    <Stack spacing="sm">
      {renderCopyOrderMode()}
      {renderEquitySL()}
      {renderCopyVolumeMode()}
      <div>
        {isAdminProvider && <Button onClick={onSave}>{`[${parentName}] Save`}</Button>}
      </div>
    </Stack>
  );
}

interface ManageCopySettingsProps {
  onClose?: () => void;
}

function ManageCopySettings({
  onClose,
}: ManageCopySettingsProps) {
  const {
    accountId = '',
    settings = {},
  } = storeUser.useStore((state) => ({
    accountId: state.activeProvider?._id,
    settings: state.activeProvider?.settings,
  }));

  const otherAccounts = storeAccounts.useStore((state) => _.pickBy(
    state,
    (item) => item._id !== accountId,
  ));

  const [newParentId, setNewParentId] = useState('');

  const sortedParentIds = _.sortBy(_.keys(settings.parents));

  const onRemove = async (parentId: string) => {
    if (!(await openConfirmModal())) return;

    await updateAccountService({
      accountId,
    }, {
      settings: {
        ...settings,
        parents: _.omit(settings.parents, parentId),
      },
    }).then(() => {
      if (onClose) onClose();
    });
  };

  const onAdd = async () => {
    if (!newParentId || !otherAccounts[newParentId]) {
      toastError('Invalid Provider ID');
      return;
    }

    if (!(await openConfirmModal())) return;

    await updateAccountService({
      accountId,
    }, {
      settings: {
        ...settings,
        parents: {
          ...settings.parents,
          [newParentId]: {},
        } as Record<string, AccountCopySettings>,
      },
    }).then(() => {
      setNewParentId('');
      if (onClose) onClose();
    });
  };

  return (
    <Stack>
      <Text>Parents</Text>
      {_.map(sortedParentIds, (parentId) => (
        <Group key={parentId}>
          <Icon name="Delete" button onClick={() => onRemove(parentId)} tooltip="Remove" />
          <Text>{`[${parentId}] ${otherAccounts[parentId]?.name}`}</Text>
        </Group>
      ))}
      <Group>
        <Icon name="Add" button onClick={onAdd} tooltip="Add" />
        <TextInput
          label="Provider ID"
          value={newParentId}
          onChange={(event) => setNewParentId(event.target.value)}
        />
      </Group>
    </Stack>
  );
}

interface Props {
  onClose?: () => void;
}

function AdminSettings({ onClose }: Props) {
  const {
    accountId = '',
    roles,
    settings = {},
  } = storeUser.useStore((state) => ({
    accountId: state.activeProvider?._id,
    roles: state.info?.roles,
    settings: state.activeProvider?.settings,
  }));

  const [enableCopyParent, toggleEnableCopyParent] = useToggle(
    settings.enableCopyParent,
  );

  const accounts = storeAccounts.useStore((state) => _.pickBy(
    state,
    (item) => settings.parents?.[item._id],
  ));

  const { isAdminProvider, isManagerWeb } = getRoleProvider(roles, accountId);

  const sortedParentIds = _.sortBy(_.keys(settings.parents));

  const onSave = async () => {
    if (!(await openConfirmModal())) return;

    await updateAccountService({
      accountId,
    }, {
      settings: {
        ...settings,
        enableCopyParent,
      } as AccountSettings,
    }).then(() => {
      if (onClose) onClose();
    });
  };

  const renderCP = () => (
    <>
      <Checkbox
        checked={enableCopyParent}
        onChange={() => toggleEnableCopyParent()}
        label={(
          <Group>
            Auto Copy Parent (CP)
            <Icon name="HelpOutline" size="small" tooltip="Auto copy parent's positions" />
          </Group>
        )}
      />
      {enableCopyParent && (
        <Tabs defaultValue={sortedParentIds[0] || 'admin'}>
          <Tabs.List>
            {_.map(sortedParentIds, (parentId) => (
              <Tabs.Tab key={parentId} value={parentId}>
                <Group spacing="xs">
                  {settings.parents?.[parentId]?.enableCopy
                    ? <Icon name="Cyclone" tooltip="Copying" color="orange" size="small" />
                    : <Icon name="Pause" tooltip="Paused" color="gray" size="small" />}
                  <Text>{accounts[parentId]?.name}</Text>
                </Group>
              </Tabs.Tab>
            ))}
            {isManagerWeb && (
              <Tabs.Tab value="admin">
                <Icon name="AdminPanelSettings" tooltip="Admin" color="red" size="small" />
              </Tabs.Tab>
            )}
          </Tabs.List>
          {_.map(sortedParentIds, (parentId) => {
            const copySettings = settings.parents?.[parentId];
            return (
              <Tabs.Panel key={parentId} value={parentId} pt="xs">
                {copySettings && (
                  <ParentCopySettings
                    copySettings={copySettings}
                    parentId={parentId}
                    isAdminProvider={!!isAdminProvider}
                    onClose={onClose}
                  />
                )}
              </Tabs.Panel>
            );
          })}
          <Tabs.Panel value="admin" pt="xs">
            <ManageCopySettings />
          </Tabs.Panel>
        </Tabs>
      )}
      {isAdminProvider && <Button onClick={onSave}>Save Admin Settings</Button>}
    </>
  );

  return (
    <Stack
      style={{
        ...(!isAdminProvider && {
          pointerEvents: 'none',
          opacity: 0.5,
        }),
      }}
    >
      <Title size="h6">Admin Zone</Title>
      {renderCP()}
    </Stack>
  );
}

export default AdminSettings;
