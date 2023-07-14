import updateSymbols from '@fishprovider/swap/dist/libs/ctrader/updateSymbols';
import type { SymbolCTrader } from '@fishprovider/swap/dist/types/Symbol.model';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';

const renewProviderTypeSymbols = async (
  providerType: ProviderType,
  allSymbols: SymbolCTrader[],
) => {
  let providerTypeAccount;
  providerTypeAccount = await Mongo.collection<Account>('accounts').findOne({
    isSystem: true,
    providerType,
    providerPlatform: ProviderPlatform.ctrader,
  }, {
    projection: {
      config: 1,
    },
  });
  if (!providerTypeAccount) {
    providerTypeAccount = await Mongo.collection<Account>('accounts').findOne({
      providerType,
      providerPlatform: ProviderPlatform.ctrader,
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

const renewSymbols = async (allSymbols: SymbolCTrader[]) => {
  const providerTypes = await Mongo.collection<Account>('accounts').distinct(
    'providerType',
    { providerPlatform: ProviderPlatform.ctrader },
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
