import { apiPost } from '@fishprovider/cross/dist/libs/api';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeTransactions from '@fishprovider/cross/dist/stores/transactions';
import { TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import _ from 'lodash';
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
  payId: string;
}

function RequestWithdrawModal({ payId }: Props) {
  const transaction = storeTransactions.useStore((state) => state[payId]);

  const [dstPayId, setDstPayId] = useState('');

  const {
    status, userId,
    srcId, srcAmount, srcCurrency, srcData,
    dstId, dstCurrency,
  } = transaction || {};

  const assignWithdraw = () => apiPost('/manual/assignWithdraw', { payId });

  const doneWithdraw = () => apiPost('/manual/transferWithdraw', { payId, dstPayId });

  const { mutate: assign, isLoading: isLoadingAssign } = useMutate({
    mutationFn: assignWithdraw,
  });

  const { mutate: done, isLoading: isLoadingDone } = useMutate({
    mutationFn: doneWithdraw,
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
      <Text>{`ID: ${payId}`}</Text>
      <Text>{`Status: ${_.upperFirst(status)}`}</Text>
      <Text>{`User ID: ${userId}`}</Text>
      <Divider />
      <Text>{`Wallet ID: ${srcId}`}</Text>
      <Text>{`Wallet Name: ${srcData?.name}`}</Text>
      <Text>{`Amount: ${srcAmount} ${srcCurrency}`}</Text>
      <Divider />
      <Text>{`Address: ${dstId}`}</Text>
      <Text>{`Currency: ${dstCurrency}`}</Text>
      <Divider />
    </>
  );

  if (status === TransactionStatus.new) {
    return (
      <Stack spacing="xs">
        {renderInfo()}
        <Group>
          <Button onClick={onAssign} loading={isLoadingAssign}>Assign</Button>
        </Group>
      </Stack>
    );
  }

  if (status === TransactionStatus.pending) {
    return (
      <Stack spacing="xs">
        {renderInfo()}
        <Text c="red" fw="bolder">{`Have you sent ${srcAmount} ${srcCurrency} to ${dstId}?`}</Text>
        <TextInput
          value={dstPayId}
          onChange={(event) => setDstPayId(event.target.value)}
          label="Sent TxID"
        />
        <Group>
          <Button onClick={onDone} loading={isLoadingDone}>Done</Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack spacing="xs">
      {renderInfo()}
      <Text>{`Unhandled status ${status}`}</Text>
    </Stack>
  );
}

export default RequestWithdrawModal;
