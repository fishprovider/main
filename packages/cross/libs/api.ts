import promiseCreator from '@fishprovider/utils/dist/helpers/promiseCreator';
import assert from 'assert';
import type { Axios, AxiosRequestConfig } from 'axios';
import axios from 'axios';

type ApiConfig = AxiosRequestConfig;

const axiosInstancePromise = promiseCreator<Axios>();

let logDebug = console.log;
let logError = console.error;

export const initApi = (params: {
  baseURL?: string,
  logDebug?: (...args: any[]) => void
  logError?: (...args: any[]) => void
}) => {
  const axiosInstance = axios.create({
    ...(params.baseURL && {
      baseURL: params.baseURL,
    }),
    withCredentials: true,
  });
  axiosInstancePromise.resolveExec(axiosInstance);

  if (params.logDebug) {
    logDebug = params.logDebug;
  }
  if (params.logError) {
    logError = params.logError;
  }
};

const checkSkipLog = (url: string) => url === '/logger';

async function errHandler<T>(
  handler: () => Promise<T>,
  url: string,
  payload: Record<string, any> = {},
  options?: ApiConfig,
) {
  try {
    return await handler();
  } catch (err: any) {
    const errMsg = err.response?.data || err.message || err;
    if (!checkSkipLog(url)) {
      logDebug(err, url, payload, options);
      if (axios.isCancel(err)) {
        logDebug(`API Cancelled: ${url}`);
      } else {
        logError(`API Error: ${url}, ${errMsg}`);
      }
    }
    throw new Error(errMsg);
  }
}

function apiGet<T>(
  url: string,
  payload: Record<string, any> = {},
  options?: ApiConfig,
) {
  return errHandler<T>(async () => {
    const axiosInstance = await axiosInstancePromise;
    assert(axiosInstance);
    const res = await axiosInstance.get<T>(url, {
      ...options,
      params: payload,
    });
    return res.data;
  }, url, payload, options);
}

function apiPost<T>(
  url: string,
  payload: Record<string, any> = {},
  options?: ApiConfig,
) {
  return errHandler<T>(async () => {
    const axiosInstance = await axiosInstancePromise;
    assert(axiosInstance);
    const res = await axiosInstance.post<T>(url, payload, options);
    return res.data;
  }, url, payload, options);
}

export {
  apiGet,
  apiPost,
};

export type {
  ApiConfig,
};
