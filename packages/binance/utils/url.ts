import axios from 'axios';
import hmacSHA512 from 'crypto-js/hmac-sha256';

function isEmpty(str: string) {
  if (
    typeof str === 'undefined'
    || !str
    || str.length === 0
    || str === ''
    || !/[^\s]/.test(str)
    || /^\s*$/.test(str)
    || str.replace(/\s/g, '') === ''
  ) {
    return true;
  }
  return false;
}

function buildParams(rawUrl: string, clientSecret?: string) {
  const paramsObject: {
    timestamp?: number;
    signature?: string;
  } & Record<string, any> = {};
  const url = new URL(rawUrl);
  url.searchParams.forEach((value, key) => {
    if (key === 'timestamp') {
      paramsObject.timestamp = Date.now();
    } else if (key !== 'signature' && !isEmpty(value)) {
      paramsObject[key] = value;
    }
  });

  if (clientSecret) {
    const queryString = Object.keys(paramsObject)
      .map((param) => `${encodeURIComponent(param)}=${paramsObject[param]}`)
      .join('&');
    const signature = hmacSHA512(queryString, clientSecret).toString();
    paramsObject.signature = signature;
  }

  return paramsObject;
}

const buildUrl = (rawUrl: string, clientSecret?: string) => {
  let url = rawUrl;
  const paramsObject = buildParams(rawUrl, clientSecret);
  Object.entries(paramsObject).forEach(([param, value]) => {
    const regex = new RegExp(`{{${param}}}`, 'g');
    url = url.replace(regex, value);
  });
  return url;
};

const sendRequest = async ({
  method = 'get', url, clientId, clientSecret,
}: {
  method?: string;
  url: string;
  clientId?: string;
  clientSecret?: string;
}) => {
  const config = {
    method,
    url: buildUrl(url, clientSecret),
    headers: {
      'Content-Type': 'application/json',
      ...(clientId && {
        'X-MBX-APIKEY': clientId,
      }),
    },
  };
  const res = await axios(config);
  return res.data;
};

export {
  sendRequest,
};
