import storeTransactions from '@fishbot/cross/stores/transactions';
import _ from 'lodash';

import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';

interface Props {
  payId: string;
}

function RequestTransferModal({ payId }: Props) {
  const transaction = storeTransactions.useStore((state) => state[payId]);

  if (!transaction) return null;

  const {
    status,
  } = transaction;

  return (
    <Stack>
      <Text>{`ID: ${payId}`}</Text>
      <Text>{_.upperFirst(status)}</Text>
    </Stack>
  );
}

export default RequestTransferModal;
