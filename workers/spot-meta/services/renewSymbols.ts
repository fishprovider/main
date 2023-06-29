import updateSymbols from '@fishbot/swap/libs/metatrader/updateSymbols';
import type { SymbolMetaTrader } from '@fishbot/swap/types/Symbol.model';
import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';
import type { Account } from '@fishbot/utils/types/Account.model';

const renewProviderTypeSymbols = async (
  providerType: ProviderType,
  allSymbols: SymbolMetaTrader[],
) => {
  let providerTypeAccount;
  providerTypeAccount = await Mongo.collection<Account>('accounts').findOne({
    isSystem: true,
    providerType,
    providerPlatform: ProviderPlatform.metatrader,
  }, {
    projection: {
      config: 1,
    },
  });
  if (!providerTypeAccount) {
    providerTypeAccount = await Mongo.collection<Account>('accounts').findOne({
      providerType,
      providerPlatform: ProviderPlatform.metatrader,
    }, {
      projection: {
        config: 1,
      },
    });
  }
  if (!providerTypeAccount) {
    Logger.warn(`No account found for providerType ${providerType}`);
    return;
  }
  await updateSymbols({
    providerId: providerTypeAccount._id,
    providerType,
    config: providerTypeAccount.config,
    allSymbols,
  });
};

const renewSymbols = async (allSymbols: SymbolMetaTrader[]) => {
  const providerTypes = await Mongo.collection<Account>('accounts').distinct(
    'providerType',
    { providerPlatform: ProviderPlatform.metatrader },
  );
  for (const providerType of providerTypes) {
    try {
      await renewProviderTypeSymbols(providerType, allSymbols);
    } catch (err) {
      Logger.error(err);
    }
  }
};

export default renewSymbols;
