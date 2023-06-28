import axios from 'axios';

import type {
  ChargeReq, ChargeRes, ChargesResPagination,
} from '~types/coinbaseCommerce.model';

const env = {
  commerceApi: process.env.COINBASE_COMMERCE_API || '',
  commerceApiVersion: process.env.COINBASE_COMMERCE_API_VERSION || '',
};

const axiosInstance = axios.create({
  baseURL: 'https://api.commerce.coinbase.com',
  headers: {
    'X-CC-Api-Key': env.commerceApi,
    'X-CC-Version': env.commerceApiVersion,
  },
});

const listPayments = async () => {
  const { data: res } = await axiosInstance.get<{ data: ChargeRes[], pagination: ChargesResPagination }>('/charges');
  return res;
};

const createPayment = async (req: ChargeReq) => {
  const { data: res } = await axiosInstance.post<{ data: ChargeRes }>('/charges', req);
  return res.data;
};

const getPayment = async (chargeIdOrCode: string) => {
  const { data: res } = await axiosInstance.get<{ data: ChargeRes }>(`/charges/${chargeIdOrCode}`);
  return res.data;
};

const cancelPayment = async (chargeIdOrCode: string) => {
  const { data: res } = await axiosInstance.post<{ data: ChargeRes }>(`/charges/${chargeIdOrCode}/cancel`);
  return res.data;
};

const resolvePayment = async (chargeIdOrCode: string) => {
  const { data: res } = await axiosInstance.post<{ data: ChargeRes }>(`/charges/${chargeIdOrCode}/resolve`);
  return res.data;
};

const verifyEvent = async (payload: any, headers: any) => {
  Logger.warn('TODO', payload, headers);

  // TODO: verify payload and headers
  // https://docs.cloud.coinbase.com/commerce/docs/webhooks-security
  // https://github.com/coinbase/coinbase-commerce-node#verify-signature-header
};

const handleEvent = async (
  payload: any,
  handler: (
    paymentEventType: any, // TODO: define type
    payload: any,
  ) => any,
) => {
  // TODO: handle event and wrap to FishProvider event
  // https://docs.cloud.coinbase.com/commerce/docs/webhooks-events
  // https://docs.cloud.coinbase.com/commerce/docs/payment-status

  handler('paymentEventType.foo', payload);
};

export {
  cancelPayment,
  createPayment,
  getPayment,
  handleEvent,
  listPayments,
  resolvePayment,
  verifyEvent,
};
