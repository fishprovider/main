import transferAdd from '@fishprovider/cross/dist/api/transfer/add';
import transferGetMany from '@fishprovider/cross/dist/api/transfer/getMany';
import { useMutate, useQuery } from '@fishprovider/cross/dist/libs/query';
import storeTransactions from '@fishprovider/cross/dist/stores/transactions';
import { TransactionType } from '@fishprovider/utils/dist/constants/pay';
import _ from 'lodash';
import { useState } from 'react';

import { queryKeys } from '~constants/query';
import Button from '~ui/core/Button';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';
import { refreshMS } from '~utils';

import TransferTransaction from './TransferTransaction';

function Transfer() {
  const transactions = storeTransactions.useStore((state) => _.filter(
    state,
    (item) => item.type === TransactionType.transfer,
  ));

  const [amount, setAmount] = useState<number | string>(100);
  const [email, setEmail] = useState('');

  useQuery({
    queryFn: () => transferGetMany({}),
    queryKey: queryKeys.transactions(TransactionType.transfer),
    refetchInterval: refreshMS,
  });

  const { mutate: transfer, isLoading } = useMutate({
    mutationFn: transferAdd,
  });

  const onTransfer = async () => {
    if (!amount) {
      toastError('Amount is required');
      return;
    }
    if (!email) {
      toastError('Email is required');
      return;
    }

    if (!(await openConfirmModal())) return;

    transfer({ amount: +amount, email }, {
      onSuccess: () => {
        toastSuccess('Done');
      },
      onError: (err) => {
        toastError(`${err}`);
      },
    });
  };

  const checkAmount = () => {
    if (!amount) return 'Amount is required';
    return undefined;
  };

  return (
    <Stack py="xs">
      <Title>Transfer</Title>
      <NumberInput
        label="Amount (USD)"
        rightSection="USD"
        value={amount}
        onChange={(value) => setAmount(value)}
        error={checkAmount()}
      />
      <TextInput
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="pet@fishprovider.com"
      />
      <Button onClick={onTransfer} loading={isLoading}>Request now ➜ 🛎️</Button>

      <Title size="h4">Transactions</Title>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>#</Table.Header>
            <Table.Header>Time</Table.Header>
            <Table.Header>Amount</Table.Header>
            <Table.Header>From</Table.Header>
            <Table.Header>To</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {_.orderBy(transactions, ['createdAt'], ['desc']).map((item, index) => (
            <TransferTransaction key={item._id} transaction={item} rowOrder={index + 1} />
          ))}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default Transfer;
