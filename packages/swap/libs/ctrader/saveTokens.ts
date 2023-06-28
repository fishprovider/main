import type { Account } from '@fishbot/utils/types/Account.model';

const saveTokens = async (
  refreshToken: string,
  tokens: {
    accessToken: string,
    refreshToken: string
  },
) => {
  const res = await Mongo.collection<Account>('accounts').updateMany(
    {
      'config.refreshToken': refreshToken,
    },
    {
      $set: {
        'config.refreshToken': tokens.refreshToken,
        'config.accessToken': tokens.accessToken,
        'config.refreshedAt': new Date(),
      },
    },
  );
  Logger.warn(`Saved new tokens to ${res.modifiedCount} accounts`);
};

export default saveTokens;
