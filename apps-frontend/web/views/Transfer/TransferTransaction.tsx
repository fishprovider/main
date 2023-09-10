import transferGet from '@fishprovider/cross/dist/api/transfer/get';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import { TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';

interface Props {
  transaction: Transaction;
  rowOrder: number;
}

const processingStatus = [
  TransactionStatus.new,
  TransactionStatus.pending,
];

function TransferTransaction({ transaction, rowOrder }: Props) {
  const {
    _id: payId, status, createdAt, srcId, srcAmount, srcData, dstId, dstData,
  } = transaction;

  const { mutate: reload, isLoading } = useMutate({
    mutationFn: transferGet,
  });

  const onReload = () => reload({ payId });

  return (
    <Table.Row>
      <Table.Cell>{`#${rowOrder}`}</Table.Cell>
      <Table.Cell>{new Date(createdAt).toLocaleString()}</Table.Cell>
      <Table.Cell>{srcAmount}</Table.Cell>
      <Table.Cell>{srcData?.name || srcId}</Table.Cell>
      <Table.Cell>{dstData?.name || dstId}</Table.Cell>
      <Table.Cell>
        <Group spacing="xs">
          {_.upperFirst(status)}
          {processingStatus.includes(status) && (
            <Icon name="Sync" size="small" button onClick={onReload} loading={isLoading} />
          )}
        </Group>
      </Table.Cell>
    </Table.Row>
  );
}

export default TransferTransaction;
