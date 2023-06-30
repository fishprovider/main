import depositCancel from '@fishbot/cross/api/deposit/cancel';
import depositGet from '@fishbot/cross/api/deposit/get';
import { useMutate } from '@fishbot/cross/libs/query';
import { SourceType, TransactionStatus } from '@fishbot/utils/constants/pay';
import type { Transaction } from '@fishbot/utils/types/Pay.model';
import _ from 'lodash';

import Link from '~components/base/Link';
import { SourceTypeText } from '~constants/pay';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';

interface Props {
  transaction: Transaction;
  rowOrder: number;
}

const processingStatus = [
  TransactionStatus.new,
  TransactionStatus.pending,
];

function DepositTransaction({ transaction, rowOrder }: Props) {
  const {
    _id: payId, status, createdAt, srcType, srcAmount, srcData, srcPayUrl,
    dstAmount = 0,
  } = transaction;

  const { mutate: cancel, isLoading: isLoadingCancel } = useMutate({
    mutationFn: depositCancel,
  });

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: depositGet,
  });

  const onPay = async () => {
    if (srcPayUrl) window.open(srcPayUrl);
  };

  const onCancel = async () => {
    if (!(await openConfirmModal())) return;

    cancel({ payId, srcType }, {
      onSuccess: () => {
        toastSuccess('Done');
      },
      onError: (err) => {
        toastError(`${err}`);
      },
    });
  };

  const onReload = () => reload({ payId, srcType });

  const renderOnChainTransaction = (txId: string) => {
    const url = `https://etherscan.io/tx/${txId}`;
    return (
      <Link key={txId} href={url} target="_blank">
        {`Tx ${txId.substring(0, 6)}...`}
      </Link>
    );
  };

  const renderOnChainTransactions = () => {
    if (srcType === SourceType.coinbaseCommerce) {
      return srcData?.payments?.map((item: any) => {
        const txId = item?.transaction_id;
        if (!txId) return null;
        return renderOnChainTransaction(txId);
      });
    }

    if (srcType === SourceType.requestFinance) {
      const txId = srcData?.paymentMetadata?.txHash;
      if (!txId) return null;
      return renderOnChainTransaction(txId);
    }

    return null;
  };

  const isProcessing = processingStatus.includes(status);

  return (
    <Table.Row>
      <Table.Cell>{`#${rowOrder}`}</Table.Cell>
      <Table.Cell>{new Date(createdAt).toLocaleString()}</Table.Cell>
      <Table.Cell>{srcAmount}</Table.Cell>
      <Table.Cell>{dstAmount}</Table.Cell>
      <Table.Cell>{SourceTypeText[srcType]}</Table.Cell>
      <Table.Cell>
        <Group spacing="xs">
          {_.upperFirst(status)}
          {isProcessing ? (
            <>
              <Icon name="Sync" size="small" button onClick={onReload} loading={isLoadingReload} />
              {srcPayUrl && <Button size="xs" color="green" onClick={onPay}>Pay now ➜ 💰</Button>}
              <Button size="xs" variant="subtle" onClick={onCancel} loading={isLoadingCancel}>Cancel</Button>
            </>
          ) : (
            <Stack spacing="xs">
              {renderOnChainTransactions()}
            </Stack>
          )}
        </Group>
      </Table.Cell>
    </Table.Row>
  );
}

export default DepositTransaction;
