import walletGetMany from '@fishprovider/cross/dist/api/wallet/getMany';
import withdrawAdd from '@fishprovider/cross/dist/api/withdraw/add';
import drawGetMany from '@fishprovider/cross/dist/api/withdraw/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useMutate, useQuery } from '@fishprovider/cross/dist/libs/query';
import storeTransactions from '@fishprovider/cross/dist/stores/transactions';
import storeWallets from '@fishprovider/cross/dist/stores/wallets';
import { TransactionType, WalletType } from '@fishprovider/utils/dist/constants/pay';
import _ from 'lodash';
import { useState } from 'react';

import Link from '~components/base/Link';
import RequiredVerifyPhone from '~components/user/RequiredVerifyPhone';
import { getUserInfoController } from '~controllers/user.controller';
import Button from '~ui/core/Button';
import NumberInput from '~ui/core/NumberInput';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import openModal from '~ui/modals/openModal';
import { toastError, toastSuccess } from '~ui/toast';
import { refreshMS } from '~utils';

import AddTrustWalletModal from './AddTrustWalletModal';
import WithdrawTransaction from './WithdrawTransaction';

function Withdraw() {
  const transactions = storeTransactions.useStore((state) => _.filter(
    state,
    (item) => item.type === TransactionType.withdraw,
  ));

  const wallets = storeWallets.useStore((state) => _.filter(
    state,
    (item) => item.type === WalletType.external,
  ));

  const [amount, setAmount] = useState<number | string>(100);
  const [dstWalletIdInput, setDstWalletIdInput] = useState<string>();

  useQuery({
    queryFn: () => drawGetMany({}),
    queryKey: queryKeys.transactions(TransactionType.withdraw),
    refetchInterval: refreshMS,
  });

  useQuery({
    queryFn: () => walletGetMany({ type: WalletType.external }),
    queryKey: queryKeys.wallets(WalletType.external),
    refetchInterval: refreshMS,
  });

  const { mutate: withdraw, isLoading } = useMutate({
    mutationFn: withdrawAdd,
  });

  const dstWalletId = dstWalletIdInput || wallets[0]?._id;

  const onWithdraw = async () => {
    if (!amount) {
      toastError('Amount is required');
      return;
    }
    if (!dstWalletId) {
      toastError('Please select a trust wallet to withdraw');
      return;
    }
    if (!getUserInfoController().activeUser?.telegram?.phoneNumber) {
      toastError('Please verify your phone number first');
      return;
    }

    if (!(await openConfirmModal())) return;

    withdraw({ amount: +amount, dstWalletId }, {
      onSuccess: () => {
        toastSuccess('Done');
      },
      onError: (err) => {
        toastError(`${err}`);
      },
    });
  };

  const onAdd = (event: MouseEvent) => {
    event.preventDefault();
    openModal({
      title: <Title size="h4">Add Trust Wallet</Title>,
      content: <AddTrustWalletModal />,
      size: '100%',
    });
  };

  const checkAmount = () => {
    if (!amount) return 'Amount is required';
    return undefined;
  };

  const dstWallet = wallets.find((item) => item._id === dstWalletId);

  return (
    <Stack py="xs">
      <Title>Withdraw</Title>
      <NumberInput
        label="Amount (USD)"
        rightSection="USD"
        value={amount}
        onChange={(value) => setAmount(value)}
        error={checkAmount()}
      />
      <Select
        label={(
          <Text>
            {'Select a trust wallet or '}
            <Link href="#add" onClick={onAdd}>Add a trust wallet</Link>
          </Text>
        )}
        data={wallets.map((item) => ({
          label: item.name,
          value: item._id,
        }))}
        value={dstWalletId}
        onChange={(value) => {
          if (value) setDstWalletIdInput(value);
        }}
      />
      {dstWallet && (
        <>
          <Text>{`Currency: ${dstWallet.currency}`}</Text>
          <Text>{`Address: ${dstWallet.address}`}</Text>
        </>
      )}
      <Button onClick={onWithdraw} loading={isLoading}>Request now ➜ 🛎️</Button>

      <Title size="h4">Transactions</Title>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>#</Table.Header>
            <Table.Header>Time</Table.Header>
            <Table.Header>Amount</Table.Header>
            <Table.Header>Wallet</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {_.orderBy(transactions, ['createdAt'], ['desc']).map((item, index) => (
            <WithdrawTransaction key={item._id} transaction={item} rowOrder={index + 1} />
          ))}
        </Table.TBody>
      </Table>

      <RequiredVerifyPhone />
    </Stack>
  );
}

export default Withdraw;
