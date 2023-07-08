import { TransactionStatus } from '@fishprovider/utils/constants/pay';
import _ from 'lodash';

import { InvoiceStatus } from '~constants/requestFinance';
import { getPayment } from '~libs/requestFinance';
import type { InvoiceGet } from '~types/requestFinance.model';

const transformStatus = (status?: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.open:
      return TransactionStatus.new;
    case InvoiceStatus.canceled:
      return TransactionStatus.cancelled;
    case InvoiceStatus.paid:
      return TransactionStatus.success;

    default:
      throw new Error(`Unknown payment status: ${status}`);
  }
};

const transformPayment = (res: InvoiceGet) => {
  const { status, paymentMetadata } = res;

  let srcFee = 0;
  let dstAmount = 0;
  if (status === InvoiceStatus.paid) {
    srcFee = paymentMetadata.gasFeeUsd;
    dstAmount = paymentMetadata.paidAmountUsd;
  }

  return {
    srcData: res,
    status: transformStatus(status),
    srcFee,
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
