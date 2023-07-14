import getAccounts from '@fishprovider/swap/dist/libs/ctrader/getAccounts';
import { ProviderPlatform } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import axios from 'axios';

interface Client {
  clientSecret: string,
}

const ctraderRegion = 'use'; // use, eu, au, sg

const getClient = async (mode = 'demo') => {
  const client = await Mongo.collection<Client>('clientSecrets').findOne({
    providerPlatform: ProviderPlatform.ctrader,
    mode,
  }, {
    projection: {
      clientSecret: 1,
    },
  });
  return client;
};

const accountGetAccounts = async ({ data, userInfo }: {
  data: {
    origin: string,
    path: string,
    code: string,
  },
  userInfo: User,
}) => {
  const { origin, path, code } = data;
  if (!origin || !path || !code) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const [_1, _2, mode, clientId = ''] = path.split('/');
  const redirectUrl = `${origin}${path}`;

  const client = await getClient(mode);
  const { clientSecret = '' } = client || {};

  const url = `https://openapi.ctrader.com/apps/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&client_id=${clientId}&client_secret=${clientSecret}`;
  Logger.debug(`Accessing... ${url}`);

  const res = await axios.get(url);
  Logger.debug('Got data', res.data);
  const { accessToken, refreshToken } = res.data;
  /*
  sample success
  {
    accessToken: 'LpBKdyV-Lh2cDjd4yWmn7yg_MRgUNY2gB0UoO4upY88',
    tokenType: 'bearer',
    expiresIn: 2628000,
    refreshToken: '07Vfi5eYxjteUaJuZirjN3rh0VoY2FbkiRSmO5gElA4',
    errorCode: null,
    access_token: 'LpBKdyV-Lh2cDjd4yWmn7yg_MRgUNY2gB0UoO4upY88',
    refresh_token: '07Vfi5eYxjteUaJuZirjN3rh0VoY2FbkiRSmO5gElA4',
    expires_in: 2628000
  }

  sample error
  {"errorCode":"ACCESS_DENIED","description":"Access denied. Make sure the credentials are valid."}
  */

  const baseConfig = {
    host: `${mode}-${ctraderRegion}.ctraderapi.com`,
    port: 5035,
    clientId,
    clientSecret: '', // for security, never leak this
    accessToken,
    refreshToken,
  };

  const { accounts } = await getAccounts({
    providerId: 'import-ctrader',
    config: {
      ...baseConfig,
      clientSecret,
    },
  });

  const result = accounts
    .filter((item) => (mode === 'live' ? item.isLive : !item.isLive))
    .map((item) => ({
      ...item,
      config: {
        ...baseConfig,
        accountId: item.accountId,
        traderLogin: item.traderLogin,
      },
    }));

  return { result };
};

export default accountGetAccounts;
