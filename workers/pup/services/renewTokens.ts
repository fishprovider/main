import type { Config } from '@fishbot/ctrader/types/Config.model';
import saveTokens from '@fishbot/swap/libs/ctrader/saveTokens';
import { ProviderType } from '@fishbot/utils/constants/account';
import type { Account } from '@fishbot/utils/types/Account.model';

import getTokens from '~utils/getTokens';

const env = {
  ctraderUser: process.env.CTRADER_USER || '',
  ctraderPass: process.env.CTRADER_PASS || '',
};

const renewTokens = async (providerId: string) => {
  const account = await Mongo.collection<Account>('accounts').findOne(
    {
      _id: providerId,
      providerType: ProviderType.icmarkets,
      'config.refreshToken': { $exists: true },
    },
    {
      projection: {
        config: 1,
      },
    },
  );
  if (!account) {
    Logger.error(`Account ${providerId} not found`);
    return;
  }

  const config = account.config as Config & { refreshToken: string };
  const user = config.user || env.ctraderUser;
  const pass = config.pass || env.ctraderPass;

  try {
    const tokens = await getTokens({
      user, pass, clientId: config.clientId,
    });
    await saveTokens(config.refreshToken, tokens);
  } catch (err) {
    Logger.error(`Failed to renew tokens for ${providerId}`, err);
  }
};

export default renewTokens;
