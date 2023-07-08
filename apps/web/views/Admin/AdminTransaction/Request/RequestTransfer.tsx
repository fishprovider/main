import type { Transaction } from '@fishprovider/utils/types/Pay.model';
import _ from 'lodash';
import moment from 'moment';

import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import RequestTransferModal from './RequestTransferModal';

interface Props {
  transaction: Transaction;
  rowOrder: number;
}

function RequestTransfer({ transaction, rowOrder }: Props) {
  const {
    _id: payId, status, createdAt, srcAmount, srcCurrency, srcData, dstData,
  } = transaction;

  const onEdit = () => openModal({
    title: <Title size="h4">Transfer Action</Title>,
    content: <RequestTransferModal payId={payId} />,
  });

  return (
    <Table.Row>
      <Table.Cell>{`#${rowOrder}`}</Table.Cell>
      <Table.Cell>{`${srcAmount} ${srcCurrency}`}</Table.Cell>
      <Table.Cell>{srcData?.name}</Table.Cell>
      <Table.Cell>{dstData?.name}</Table.Cell>
      <Table.Cell>{_.upperFirst(status)}</Table.Cell>
      <Table.Cell>{moment(createdAt).fromNow()}</Table.Cell>
      <Table.Cell>{new Date(createdAt).toLocaleString()}</Table.Cell>
      <Table.Cell>
        <Icon name="Settings" button onClick={onEdit} tooltip="Settings" />
      </Table.Cell>
    </Table.Row>
  );
}

export default RequestTransfer;
