import { log, promiseCreator } from '@fishprovider/core';
import { BaseGetOptions } from '@fishprovider/core-frontend';
import axios, { Axios, AxiosRequestConfig } from 'axios';

export type ApiOptions<T> = BaseGetOptions<T> & AxiosRequestConfig;

const clientPromise = promiseCreator<Axios>();

const checkSkipLog = (url: string) => url === '/logger';

const errHandler = async <T>(
  handler: () => Promise<T>,
  url: string,
  payload: Record<string, any> = {},
  options?: ApiOptions<T>,
) => {
  try {
    return await handler();
  } catch (err: any) {
    const errMsg = err.response?.data || err.message || err;
    if (!checkSkipLog(url)) {
      log.debug(err, url, payload, options);
      if (axios.isCancel(err)) {
        log.debug('API Cancelled', url);
      } else {
        log.error('API Error', url, errMsg);
      }
    }
    throw new Error(errMsg);
  }
};

export const fishApiGet = async <T>(
  url: string,
  payload: Record<string, any> = {},
  options?: ApiOptions<T>,
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
  options?: ApiOptions<T>,
) => errHandler<T>(async () => {
  const client = await clientPromise;
  const res = await client.post<T>(url, payload, options);
  return res.data;
}, url, payload, options);

export const initFishApi = (params: {
  baseURL?: string,
}) => {
  const client = axios.create({
    ...(params.baseURL && {
      baseURL: params.baseURL,
    }),
    withCredentials: true,
  });
  clientPromise.resolveExec(client);
};
