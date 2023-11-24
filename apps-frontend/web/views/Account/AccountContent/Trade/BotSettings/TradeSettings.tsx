import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import moment from 'moment';
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
import Radio from '~ui/core/Radio';
import Stack from '~ui/core/Stack';
import TimeInput from '~ui/core/TimeInput';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface Props {
  onClose?: () => void;
}

function TradeSettings({ onClose }: Props) {
  const {
    accountId = '',
    roles,
    tradeSettings = {},
  } = watchUserInfoController((state) => ({
    accountId: state.activeAccount?._id,
    roles: state.activeUser?.roles,
    tradeSettings: state.activeAccount?.tradeSettings,
  }));

  const [enabledCloseProfit, toggleEnabledCloseProfit] = useToggle(
    tradeSettings.enabledCloseProfit || false,
  );
  const [takeProfit, setTakeProfit] = useState<number | string>(
    tradeSettings.takeProfit || '',
  );
  const [stopLoss, setStopLoss] = useState<number | string>(
    tradeSettings.stopLoss || '',
  );

  const [enabledCloseEquity, toggleEnabledCloseEquity] = useToggle(
    tradeSettings.enabledCloseEquity || false,
  );
  const [targetEquity, setTargetEquity] = useState<number | string>(
    tradeSettings.targetEquity || '',
  );
  const [stopEquity, setStopEquity] = useState<number | string>(
    tradeSettings.stopEquity || '',
  );

  const [enabledCloseTime, toggleEnabledCloseTime] = useToggle(
    tradeSettings.enabledCloseTime || false,
  );
  const [closeTime, setCloseTime] = useState(tradeSettings.closeTime);
  const [closeTimeIfProfit, setCloseTimeIfProfit] = useState(
    tradeSettings.closeTimeIfProfit || false,
  );

  const { isTraderProvider } = getRoleProvider(roles, accountId);

  const onSave = async () => {
    if (enabledCloseTime) {
      if (!closeTime) {
        toastError('Invalid Close time, must be a right date time');
        return;
      }
    }

    if (!(await openConfirmModal())) return;

    await updateAccountController({
      accountId,
    }, {
      tradeSettings: {
        ...tradeSettings,

        enabledCloseProfit,
        ...(takeProfit && { takeProfit: +takeProfit }),
        ...(stopLoss && { stopLoss: +stopLoss }),

        enabledCloseEquity,
        ...(targetEquity && { targetEquity: +targetEquity }),
        ...(stopEquity && { stopEquity: +stopEquity }),

        enabledCloseTime,
        closeTime: closeTime || undefined,
        closeTimeIfProfit,
      },
    }).then(() => {
      if (onClose) onClose();
    });
  };

  const renderACP = () => (
    <Box>
      <Checkbox
        checked={enabledCloseProfit}
        onChange={() => toggleEnabledCloseProfit()}
        label={(
          <Group>
            Auto Close Profit (ACP)
            <Icon name="HelpOutline" size="small" tooltip="Auto close all positions based on Profit" />
          </Group>
        )}
      />
      {enabledCloseProfit && (
        <Stack spacing="sm">
          <NumberInput
            label="Target Profit"
            value={takeProfit}
            onChange={(value) => setTakeProfit(value)}
          />
          <NumberInput
            label="Stop Profit"
            value={stopLoss}
            onChange={(value) => setStopLoss(value)}
          />
        </Stack>
      )}
    </Box>
  );

  const renderACE = () => (
    <Box>
      <Checkbox
        checked={enabledCloseEquity}
        onChange={() => toggleEnabledCloseEquity()}
        label={(
          <Group>
            Auto Close Equity (ACE)
            <Icon name="HelpOutline" size="small" tooltip="Auto close all positions based on equity" />
          </Group>
        )}
      />
      {enabledCloseEquity && (
        <Stack spacing="sm">
          <NumberInput
            label="Target Equity"
            value={targetEquity}
            onChange={(value) => setTargetEquity(value)}

          />
          <NumberInput
            label="Stop Equity"
            value={stopEquity}
            onChange={(value) => setStopEquity(value)}
          />
        </Stack>
      )}
    </Box>
  );

  const renderACT = () => (
    <Box>
      <Checkbox
        checked={enabledCloseTime}
        onChange={() => toggleEnabledCloseTime()}
        label={(
          <Group>
            Auto Close Time (ACT)
            <Icon name="HelpOutline" size="small" tooltip="Auto close all positions at this preset time" />
          </Group>
        )}
      />
      {enabledCloseTime && (
        <Stack spacing="sm">
          <TimeInput
            value={closeTime && moment(closeTime).format('HH:mm')}
            onChange={(event) => setCloseTime(moment(event.target.value, 'HH:mm').toDate())}
          />
          <Group>
            <Radio
              checked={!closeTimeIfProfit}
              onChange={() => setCloseTimeIfProfit(false)}
              label="Any Profit"
            />
            <Radio
              checked={closeTimeIfProfit}
              onChange={() => setCloseTimeIfProfit(true)}
              label="Positive Profit Only"
            />
          </Group>
        </Stack>
      )}
    </Box>
  );

  return (
    <Stack style={{
      ...(!isTraderProvider && {
        pointerEvents: 'none',
        opacity: 0.5,
      }),
    }}
    >
      <Title size="h6">Trader Zone</Title>
      {renderACP()}
      {renderACE()}
      {renderACT()}
      {isTraderProvider && <Button onClick={onSave}>Save Trader Settings</Button>}
    </Stack>
  );
}

export default TradeSettings;
