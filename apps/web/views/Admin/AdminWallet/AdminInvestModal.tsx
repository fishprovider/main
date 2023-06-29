import { apiPost } from '@fishbot/cross/libs/api';
import { useMutate } from '@fishbot/cross/libs/query';
import storeWallets from '@fishbot/cross/stores/wallets';
import { InvestStatus } from '@fishbot/utils/constants/pay';
import { useState } from 'react';

import Button from '~ui/core/Button';
import Divider from '~ui/core/Divider';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';

interface Props {
  walletId: string;
}

function AdminInvestModal({ walletId }: Props) {
  const wallet = storeWallets.useStore((state) => state[walletId]);

  const [dstProviderId, setDstProviderId] = useState('');

  const {
    investStatus,
    investData,
    name, balance, currency,
    userId, userEmail, userName,
  } = wallet || {};

  const {
    providerId, providerName,
    startedAt, balanceStart,
  } = investData || {};

  const assignInvest = () => apiPost('/manual/assignInvest', { walletId });

  const doneInvest = () => (startedAt
    ? apiPost('/manual/stopInvest', { walletId })
    : apiPost('/manual/startInvest', { walletId, dstProviderId }));

  const { mutate: assign, isLoading: isLoadingAssign } = useMutate({
    mutationFn: assignInvest,
  });

  const { mutate: done, isLoading: isLoadingDone } = useMutate({
    mutationFn: doneInvest,
  });

  const onAssign = async () => {
    if (!(await openConfirmModal())) return;

    assign(undefined, {
      onSuccess: () => {
        toastSuccess('Done');
        window.location.reload();
      },
      onError: (err) => {
        toastError(`${err}`);
        window.location.reload();
      },
    });
  };

  const onDone = async () => {
    if (!(await openConfirmModal())) return;

    done(undefined, {
      onSuccess: () => {
        toastSuccess('Done');
        window.location.reload();
      },
      onError: (err) => {
        toastError(`${err}`);
        window.location.reload();
      },
    });
  };

  const renderInfo = () => (
    <>
      <Text>{`Provider ID: ${providerId}`}</Text>
      <Text>{`Provider Name: ${providerName}`}</Text>
      <Divider />
      {startedAt && (
        <>
          <Text>{`Started At: ${new Date(startedAt).toLocaleString()}`}</Text>
          <Text>{`Balance Start: ${balanceStart} ${currency}`}</Text>
          <Divider />
        </>
      )}
      <Text>{`Wallet ID: ${walletId}`}</Text>
      <Text>{`Wallet Name: ${name}`}</Text>
      <Text>{`Wallet Balance: ${balance} ${currency}`}</Text>
      <Divider />
      <Text>{`User ID: ${userId}`}</Text>
      <Text>{`User Name: ${userName}`}</Text>
      <Text>{`Email: ${userEmail}`}</Text>
      <Divider />
    </>
  );

  if (investStatus && [InvestStatus.new, InvestStatus.stopping].includes(investStatus)) {
    return (
      <Stack spacing="xs">
        {renderInfo()}
        <Group>
          <Button onClick={onAssign} loading={isLoadingAssign}>Assign</Button>
        </Group>
      </Stack>
    );
  }

  if (investStatus === InvestStatus.pending) {
    return (
      <Stack spacing="xs">
        {renderInfo()}
        {startedAt ? (
          <Text c="red" fw="bolder">{`Have you removed ${balance} ${currency} from ${providerName}?`}</Text>
        ) : (
          <>
            <Text c="red" fw="bolder">{`Have you added ${balance} ${currency} to ${providerName}?`}</Text>
            <TextInput
              value={dstProviderId}
              onChange={(event) => setDstProviderId(event.target.value)}
              label="(Optional) Destination Provider ID to fund"
              placeholder="earth2"
            />
          </>
        )}
        <Group>
          <Button onClick={onDone} loading={isLoadingDone}>Done</Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack spacing="xs">
      {renderInfo()}
      <Text>{`Unhandled status ${investStatus}`}</Text>
    </Stack>
  );
}

export default AdminInvestModal;
