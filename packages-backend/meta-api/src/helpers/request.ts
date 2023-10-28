import axios, { AxiosRequestConfig } from 'axios';

// ref: https://metaapi.cloud/docs/client/restApi/api/readTradingTerminalState/readAccountInformation/
const clientUrl = 'https://mt-client-api-v1.new-york.agiliumtrade.ai';

// ref: https://metaapi.cloud/docs/provisioning/api/account/createAccount/
const provisioningUrl = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai';

export async function sendRequest<T>({
  mode = 'client',
  method = 'get',
  url,
  clientSecret,
  data,
}: {
  mode?: 'client' | 'provisioning';
  method?: string;
  url: string;
  clientSecret?: string;
  data?: Record<string, any>,
}) {
  const getBaseUrl = () => {
    if (mode === 'provisioning') {
      return provisioningUrl;
    }
    return clientUrl;
  };

  const config: AxiosRequestConfig = {
    headers: {
      Accept: 'application/json',
      ...(clientSecret && {
        'auth-token': clientSecret,
      }),
    },
    baseURL: getBaseUrl(),
  };

  try {
    switch (method) {
      case 'get': {
        const res = await axios.get<T>(url, config);
        return res.data;
      }
      case 'post': {
        const res = await axios.post<T>(url, data, config);
        return res.data;
      }
      case 'delete': {
        const res = await axios.delete<T>(url, config);
        return res.data;
      }
      default:
        throw new Error(`Unknown method ${method}`);
    }
  } catch (err: any) {
    console.error(err?.response?.data);
    throw err;
  }
}
