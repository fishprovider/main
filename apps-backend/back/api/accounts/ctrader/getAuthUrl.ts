import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';

interface Client {
  clientId: string,
}

const getClient = async (live?: boolean) => {
  const client = await Mongo.collection<Client>('clientSecrets').findOne({
    accountPlatform: AccountPlatform.ctrader,
    mode: live ? 'live' : 'demo',
  }, {
    projection: {
      clientId: 1,
    },
  });
  return client;
};

const accountGetAuthUrl = async ({ data }: {
  data: {
    origin: string,
    scope: string, // accounts or trading
    live?: boolean,
  }
}) => {
  const { origin, scope, live } = data;
  if (!origin) {
    return { error: ErrorType.badRequest };
  }

  const client = await getClient(live);
  const { clientId } = client || {};

  const redirectUrl = `${origin}/ctrader-auth/${live ? 'live' : 'demo'}/${clientId}`;

  const url = `https://openapi.ctrader.com/apps/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`;

  return { result: url };
};

export default accountGetAuthUrl;
