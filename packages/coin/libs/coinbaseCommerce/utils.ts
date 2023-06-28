import { TransactionStatus } from '@fishbot/utils/constants/pay';
import _ from 'lodash';

import { ChargeStatus } from '~constants/coinbaseCommerce';
import { getPayment } from '~libs/coinbaseCommerce';
import type { ChargeRes } from '~types/coinbaseCommerce.model';

const transformStatus = (status?: ChargeStatus) => {
  switch (status) {
    case ChargeStatus.NEW:
      return TransactionStatus.new;
    case ChargeStatus.CANCELED:
      return TransactionStatus.cancelled;
    case ChargeStatus.EXPIRED:
      return TransactionStatus.expired;
    case ChargeStatus.PENDING:
      return TransactionStatus.pending;

    case ChargeStatus.COMPLETED:
    case ChargeStatus.RESOLVED:
      return TransactionStatus.success;

    case ChargeStatus.UNRESOLVED:
      return TransactionStatus.failed;

    default:
      throw new Error(`Unknown payment status: ${status}`);
  }
};

const transformPayment = (res: ChargeRes) => {
  const { timeline, payments } = res;
  const status = timeline[timeline.length - 1]?.status;

  let dstAmount = 0;
  if (status === ChargeStatus.COMPLETED) {
    dstAmount = _.sumBy(payments, (item) => +item.net.crypto.amount);
  }

  return {
    srcData: res,
    status: transformStatus(status),
    dstAmount,
  };
};

const getTransactionUpdates = async (chargeIdOrCode: string) => {
  const res = await getPayment(chargeIdOrCode);
  return transformPayment(res);
};

export {
  getTransactionUpdates,
};
