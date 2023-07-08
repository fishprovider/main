import { apiPost } from '@fishprovider/cross/libs/api';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeTransactions from '@fishprovider/cross/stores/transactions';
import { TransactionStatus, TransactionType } from '@fishprovider/utils/constants/pay';
import type { Transaction } from '@fishprovider/utils/types/Pay.model';
import _ from 'lodash';
import React from 'react';

import { queryKeys } from '~constants/query';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Title from '~ui/core/Title';
import { refreshMS } from '~utils';

import RequestDeposit from './RequestDeposit';
import RequestTransfer from './RequestTransfer';
import RequestWithdraw from './RequestWithdraw';

const doneStatuses = [
  TransactionStatus.cancelled,
  TransactionStatus.expired,
  TransactionStatus.success,
  TransactionStatus.failed,
];

function Request() {
  const transactions = storeTransactions.useStore((state) => _.filter(
    state,
    (item) => !doneStatuses.includes(item.status)
      && !!item.statusRequest,
  ));

  const manualGetManyRequest = async () => {
    const docs = await apiPost<Transaction[]>('/manual/getManyRequest');
    storeTransactions.mergeDocs(docs);
    return docs;
  };

  useQuery({
    queryFn: () => manualGetManyRequest(),
    queryKey: queryKeys.transactionRequests(),
    refetchInterval: refreshMS,
  });

  const withdraws = transactions.filter((item) => item.type === TransactionType.withdraw);
  const transfers = transactions.filter((item) => item.type === TransactionType.transfer);
  const deposits = transactions.filter((item) => item.type === TransactionType.deposit);

  return (
    <Stack py="lg">
      <Title>🥶🥶🥶 Requests 🥶🥶🥶</Title>

      <Title size="h4">Withdraw Requests</Title>
      <Table>
        <Table.TBody>
          {_.orderBy(withdraws, ['createdAt'], ['asc']).map((item, index) => (
            <RequestWithdraw key={item._id} transaction={item} rowOrder={index + 1} />
          ))}
        </Table.TBody>
      </Table>

      <Title size="h4">Transfer Requests</Title>
      <Table>
        <Table.TBody>
          {_.orderBy(transfers, ['createdAt'], ['asc']).map((item, index) => (
            <RequestTransfer key={item._id} transaction={item} rowOrder={index + 1} />
          ))}
        </Table.TBody>
      </Table>

      <Title size="h4">Deposit Requests</Title>
      <Table>
        <Table.TBody>
          {_.orderBy(deposits, ['createdAt'], ['asc']).map((item, index) => (
            <RequestDeposit key={item._id} transaction={item} rowOrder={index + 1} />
          ))}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default Request;
