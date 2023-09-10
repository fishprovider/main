import withdrawGet from '@fishprovider/cross/dist/api/withdraw/get';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import { DestinationPayType, TransactionStatus } from '@fishprovider/utils/dist/constants/pay';
import type { Transaction } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';

import Link from '~components/base/Link';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';

interface Props {
  transaction: Transaction;
  rowOrder: number;
}

const processingStatus = [
  TransactionStatus.new,
  TransactionStatus.pending,
];

function WithdrawTransaction({ transaction, rowOrder }: Props) {
  const {
    _id: payId, status, createdAt, srcAmount, dstId, dstPayType, dstData, dstPayId,
  } = transaction;

  const { mutate: reload, isLoading } = useMutate({
    mutationFn: withdrawGet,
  });

  const onReload = () => reload({ payId });

  const url = dstPayType === DestinationPayType.manual
    ? `https://etherscan.io/tx/${dstPayId}`
    : `https://etherscan.io/address/${dstId}#tokentxns`;

  return (
    <Table.Row>
      <Table.Cell>{`#${rowOrder}`}</Table.Cell>
      <Table.Cell>{new Date(createdAt).toLocaleString()}</Table.Cell>
      <Table.Cell>{srcAmount}</Table.Cell>
      <Table.Cell>{dstData?.name || dstId}</Table.Cell>
      <Table.Cell>
        <Group spacing="xs">
          {_.upperFirst(status)}
          {processingStatus.includes(status) ? (
            <Icon name="Sync" size="small" button onClick={onReload} loading={isLoading} />
          ) : (
            <Link href={url} target="_blank">
              <Text>{`Tx ${dstId.substring(0, 6)}...`}</Text>
            </Link>
          )}
        </Group>
      </Table.Cell>
    </Table.Row>
  );
}

export default WithdrawTransaction;
