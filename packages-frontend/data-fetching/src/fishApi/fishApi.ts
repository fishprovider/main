import { log, promiseCreator } from '@fishprovider/core-utils';
import axios, { Axios, AxiosRequestConfig } from 'axios';

export type ApiConfig = AxiosRequestConfig;

const clientPromise = promiseCreator<Axios>();

let logDebug = log.debug;
let logError = log.error;

export const startFishApi = async (params: {
  baseURL?: string,
  logDebug?: (...args: any[]) => void
  logError?: (...args: any[]) => void
}) => {
  const client = axios.create({
    ...(params.baseURL && {
      baseURL: params.baseURL,
    }),
    withCredentials: true,
  });
  clientPromise.resolveExec(client);

  if (params.logDebug) {
    logDebug = params.logDebug;
  }
  if (params.logError) {
    logError = params.logError;
  }

  return client;
};

const checkSkipLog = (url: string) => url === '/logger';

const errHandler = async <T>(
  handler: () => Promise<T>,
  url: string,
  payload: Record<string, any> = {},
  options?: ApiConfig,
) => {
  try {
    return await handler();
  } catch (err: any) {
    const errMsg = err.response?.data || err.message || err;
    if (!checkSkipLog(url)) {
      logDebug(err, url, payload, options);
      if (axios.isCancel(err)) {
        logDebug('API Cancelled', url);
      } else {
        logError('API Error', url, errMsg);
      }
    }
    throw new Error(errMsg);
  }
};

export const fishApiGet = async <T>(
  url: string,
  payload: Record<string, any> = {},
  options?: ApiConfig,
) => errHandler<T>(async () => {
  const client = await clientPromise;
  const res = await client.get<T>(url, {
    ...options,
    params: payload,
  });
  return res.data;
}, url, payload, options);

export const fishApiPost = async<T>(
  url: string,
  payload: Record<string, any> = {},
  options?: ApiConfig,
) => errHandler<T>(async () => {
  const client = await clientPromise;
  const res = await client.post<T>(url, payload, options);
  return res.data;
}, url, payload, options);
