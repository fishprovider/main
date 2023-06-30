import depositAdd from '@fishbot/cross/api/deposit/add';
import depositGetMany from '@fishbot/cross/api/deposit/getMany';
import { useMutate, useQuery } from '@fishbot/cross/libs/query';
import storeTransactions from '@fishbot/cross/stores/transactions';
import { SourceType, TransactionType } from '@fishbot/utils/constants/pay';
import _ from 'lodash';
import { useState } from 'react';

import { SourceTypeText } from '~constants/pay';
import { queryKeys } from '~constants/query';
import Button from '~ui/core/Button';
import Card from '~ui/core/Card';
import Chip from '~ui/core/Chip';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';
import { refreshMS } from '~utils';

import DepositTransaction from './DepositTransaction';

const srcTypes = [
  {
    value: SourceType.coinbaseCommerce,
    label: SourceTypeText[SourceType.coinbaseCommerce],
    icon: '/icons/coinbase.svg',
    fee: 2,
  },
  {
    value: SourceType.requestFinance,
    label: SourceTypeText[SourceType.requestFinance],
    icon: '/icons/request-finance.svg',
    fee: 1,
  },
  {
    value: SourceType.fishPay,
    label: SourceTypeText[SourceType.fishPay],
    icon: '/logo.png',
    fee: 0,
  },
];

const requestFinanceCurrencies = [
  { value: 'USDT-mainnet', label: 'USDT (ERC-20)' },
  { value: 'USDT-tron', label: 'USDT (TRC-20)' },
  { value: 'USDT-bsc', label: 'USDT (BEP-20)' },
  { value: 'USDC-mainnet', label: 'USDC (ERC-20)' },
  { value: 'USDC-tron', label: 'USDC (TRC-20)' },
  { value: 'BUSD-bsc', label: 'BUSD (BEP-20)' },
  { value: 'DAI-mainnet', label: 'DAI (ERC-20)' },
  { value: 'BTC-mainnet', label: 'BTC' },
  { value: 'ETH-mainnet', label: 'ETH' },
  { value: 'BNB-bsc', label: 'BNB' },
  { value: 'SOL-solana', label: 'SOL' },
  { value: 'TRX-tron', label: 'TRX' },
];

function Deposit() {
  const transactions = storeTransactions.useStore((state) => _.filter(
    state,
    (item) => item.type === TransactionType.deposit,
  ));

  const [amount, setAmount] = useState<number | string>(100);
  const [srcType, setSrcType] = useState(srcTypes[0]?.value);
  const [srcCurrency, setSrcCurrency] = useState(requestFinanceCurrencies[0]?.value);

  useQuery({
    queryFn: () => depositGetMany({}),
    queryKey: queryKeys.transactions(TransactionType.deposit),
    refetchInterval: refreshMS,
  });

  const { mutate: deposit, isLoading } = useMutate({
    mutationFn: depositAdd,
  });

  const onDeposit = async () => {
    if (!amount) {
      toastError('Amount is required');
      return;
    }

    if (!(await openConfirmModal())) return;

    deposit({ amount: +amount, srcType, srcCurrency }, {
      onSuccess: (res) => {
        toastSuccess('Done');
        const { srcPayUrl } = res;
        if (srcPayUrl) window.open(srcPayUrl);
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

  const renderCurrency = () => {
    if (srcType === SourceType.requestFinance) {
      return (
        <Chip.Group multiple={false} value={srcCurrency} onChange={setSrcCurrency}>
          <Group>
            {requestFinanceCurrencies.map((item) => (
              <Chip key={item.value} value={item.value} size="md">{item.label}</Chip>
            ))}
          </Group>
        </Chip.Group>
      );
    }
    return null;
  };

  return (
    <Stack py="xs">
      <Title>Deposit</Title>
      <NumberInput
        label="Amount (USD)"
        rightSection="USD"
        value={amount}
        onChange={(value) => setAmount(value)}
        error={checkAmount()}
      />
      <Title size="h4">Payment method</Title>
      <Group>
        {srcTypes.map((item) => (
          <Card
            key={item.value}
            onClick={() => setSrcType(item.value)}
            sx={{
              ':hover': { cursor: 'pointer' },
              border: srcType === item.value ? '2px solid green' : '',
            }}
          >
            <Stack align="center">
              <Image
                src={item.icon}
                alt={item.label}
                fit="contain"
                width="100%"
                sx={{ maxWidth: 40 }}
              />
              <Stack align="center" spacing={0}>
                <Text>{item.label}</Text>
                <Text>{`(${item.fee}% fee)`}</Text>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Group>
      {renderCurrency()}
      <Button onClick={onDeposit} loading={isLoading}>Request now ➜ 🛎️</Button>

      <Title size="h4">Transactions</Title>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.Header>#</Table.Header>
            <Table.Header>Time</Table.Header>
            <Table.Header>Deposit</Table.Header>
            <Table.Header>Received</Table.Header>
            <Table.Header>Type</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {_.orderBy(transactions, ['createdAt'], ['desc']).map((item, index) => (
            <DepositTransaction key={item._id} transaction={item} rowOrder={index + 1} />
          ))}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default Deposit;
