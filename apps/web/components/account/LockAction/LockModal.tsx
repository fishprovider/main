import lockAccount from '@fishprovider/cross/dist/api/accounts/lock/account';
import lockMember from '@fishprovider/cross/dist/api/accounts/lock/member';
import priceGetNames from '@fishprovider/cross/dist/api/prices/getNames';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { LockType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import { LockTypeText } from '~constants/account';
import { queryKeys } from '~constants/query';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import MultiSelect from '~ui/core/MultiSelect';
import NumberInput from '~ui/core/NumberInput';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import TextInput from '~ui/core/TextInput';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

const lockPeriods = [
  {
    value: 'hours',
    text: 'In some hours',
  },
  {
    value: 'days',
    text: 'In some days',
  },
];

interface Props {
  providerId: string,
  userId?: string,
  onClose?: () => void,
}

function LockModal({
  providerId,
  userId,
  onClose = () => undefined,
}: Props) {
  const {
    providerType = ProviderType.icmarkets,
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
  }));

  const allSymbols = storePrices.useStore((state) => _.filter(
    state,
    (item) => item.providerType === providerType,
  ).map((item) => item.symbol).sort());

  const [lockType, setLockType] = useState(LockType.open);
  const [lockPairs, setLockPairs] = useState<string[]>([]);
  const [lockPeriod, setLockPeriod] = useState('hours');
  const [lockHours, setLockHours] = useState<number | string>(8);
  const [lockDays, setLockDays] = useState<number | string>(1);
  const [lockMessage, setLockMessage] = useState('Have some rest 💤');

  useQuery({
    queryFn: () => priceGetNames({ providerType }),
    queryKey: queryKeys.symbols(providerType),
  });

  const validate = () => {
    if (!(lockHours || lockDays)) {
      return { error: 'Please set hours/days to lock' };
    }
    return {};
  };

  const onLock = async () => {
    const { error } = validate();
    if (error) {
      toastError(error);
      return;
    }

    const activeUser = storeUser.getState().info as User;

    const lock = {
      type: lockType,
      ...(lockType === LockType.pairs && {
        value: lockPairs,
      }),
      lockFrom: new Date(),
      lockUntil: lockPeriod === 'hours'
        ? moment().add(+lockHours, 'hours').toDate()
        : moment().add(+lockDays, 'days').toDate(),
      lockMessage,
      lockByUserId: activeUser._id,
      lockByUserName: activeUser.name,
    };

    if (!(await openConfirmModal())) return;

    if (userId) {
      await lockMember({
        providerId,
        userId,
        lock,
      }).then(() => {
        onClose();
      }).catch((err) => {
        toastError(err.message);
      });
    } else {
      await lockAccount({
        providerId,
        lock,
      }).then(() => {
        onClose();
      }).catch((err) => {
        toastError(err.message);
      });
    }
  };

  const renderLockType = () => (
    <Box>
      <Select
        label="Type"
        value={lockType}
        onChange={(value: LockType) => {
          if (!value) return;
          setLockType(value);
        }}
        data={Object.values(LockType).map((item) => ({
          value: item,
          label: LockTypeText[item],
        }))}
      />
      {lockType === LockType.pairs && (
        <MultiSelect
          label="Pairs"
          data={allSymbols}
          value={lockPairs}
          onChange={(value) => setLockPairs(value)}
          searchable
        />
      )}
    </Box>
  );

  const renderLockTime = () => (
    <Box>
      <Select
        label="Time"
        value={lockPeriod}
        onChange={(value) => {
          if (!value) return;
          setLockPeriod(value);
        }}
        data={lockPeriods.map((item) => ({
          value: item.value,
          label: item.text,
        }))}
      />
      {lockPeriod === 'hours' && (
        <NumberInput
          value={lockHours}
          onChange={(value) => {
            setLockHours(value);
            setLockDays(+value / 24);
          }}
          placeholder="12"
          rightSection="hours"
        />
      )}
      {lockPeriod === 'days' && (
        <NumberInput
          value={lockDays}
          onChange={(value) => {
            setLockDays(value);
            setLockHours(+value * 24);
          }}
          placeholder="1"
          rightSection="days"
        />
      )}
    </Box>
  );

  const renderLockMsg = () => (
    <TextInput
      label="Message"
      value={lockMessage}
      onChange={(event) => setLockMessage(event.target.value)}
      placeholder="Have some rest 💤"
    />
  );

  return (
    <Stack>
      {renderLockType()}
      {renderLockTime()}
      {renderLockMsg()}
      <Group position="right">
        <Button onClick={onLock}>Lock</Button>
        <Button onClick={onClose} variant="subtle">Close</Button>
      </Group>
    </Stack>
  );
}

export default LockModal;
