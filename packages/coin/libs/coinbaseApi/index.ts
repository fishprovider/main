import axios from 'axios';
import crypto from 'crypto';

const env = {
  apiKey: process.env.COINBASE_API_KEY || '',
  apiSecret: process.env.COINBASE_API_SECRET || '',
  apiVersion: process.env.COINBASE_API_VERSION || '',
};

const request = async (method: string, path: string, body = '') => {
  const timestamp = Math.floor(Date.now() / 1000);
  const message = timestamp + method + path + body;
  const signature = crypto.createHmac('sha256', env.apiSecret).update(message).digest('hex');

  const res = await axios({
    baseURL: 'https://api.coinbase.com/',
    url: path,
    method,
    headers: {
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-KEY': env.apiKey,
      'CB-VERSION': env.apiVersion,
    },
  });
  return res.data;
};

const listAccounts = async () => {
  const res = await request('GET', '/v2/accounts');
  return res;
};

const getAccount = async (accountId: string) => {
  const res = await request('GET', `/v2/accounts/${accountId}`);
  return res;
};

const listTransactions = async (accountId: string) => {
  const res = await request('GET', `/v2/accounts/${accountId}/transactions`);
  return res;
};

const sendTransaction = async (accountId: string, options: {
  to: string,
  currency: string,
  amount: number,
  description?: string,
}) => {
  const body = {
    ...options,
    type: 'send',
  };
  const res = await request(
    'GET',
    `/v2/accounts/${accountId}/transactions`,
    JSON.stringify(body),
  );
  return res;
};

const getTransaction = async (accountId: string, transactionId: string) => {
  const res = await request(
    'GET',
    `/v2/accounts/${accountId}/transactions/${transactionId}`,
  );
  return res;
};

const verifyEvent = async (payload: any, headers: any) => {
  // TODO: verify payload and headers
  Logger.warn('TODO', payload, headers);
};

const handleEvent = async (
  payload: any,
  handler: (
    paymentEventType: any, // TODO: define type
    payload: any,
  ) => any,
) => {
  // TODO: handle event and wrap to FishProvider event
  handler('paymentEventType.foo', payload);
};

export {
  getAccount,
  getTransaction,
  handleEvent,
  listAccounts,
  listTransactions,
  sendTransaction,
  verifyEvent,
};
