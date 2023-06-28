import axios from 'axios';

import type { InvoiceGet, InvoiceReq, InvoiceWithLinks } from '~types/requestFinance.model';

const env = {
  requestFinanceApi: process.env.REQUEST_FINANCE_API || '',
};

const axiosInstance = axios.create({
  baseURL: 'https://api.request.finance',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: env.requestFinanceApi,
  },
});

const listPayments = async () => {
  const { data: res } = await axiosInstance.get<InvoiceGet[]>('/invoices');
  return res;
};

const createPayment = async (req: InvoiceReq) => {
  const { data: offChainInvoice } = await axiosInstance.post<InvoiceGet>('/invoices', req);
  const { data: onChainInvoice } = await axiosInstance.post<InvoiceWithLinks>(`/invoices/${offChainInvoice.id}`);
  return onChainInvoice;
};

const getPayment = async (requestOrInvoiceId: string) => {
  const { data: res } = await axiosInstance.get<InvoiceGet>(`/invoices/${requestOrInvoiceId}`);
  return res;
};

const cancelPayment = async (requestOrInvoiceId: string) => {
  const { data: res } = await axiosInstance.post(`/invoices/${requestOrInvoiceId}/changes`, { type: 'cancel' });
  return res.data;
};

const acceptPayment = async (requestOrInvoiceId: string) => {
  const { data: res } = await axiosInstance.post(`/invoices/${requestOrInvoiceId}/changes`, { type: 'accept' });
  return res.data;
};

export {
  acceptPayment,
  cancelPayment,
  createPayment,
  getPayment,
  listPayments,
};
