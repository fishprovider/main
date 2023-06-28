import runPromises from '@fishbot/core/libs/queuePromise/runPromises';
import getSymbolTick from '@fishbot/swap/libs/metatrader/getSymbolTick';
import { getProvider } from '@fishbot/swap/utils/account';
import { getPrices } from '@fishbot/swap/utils/price';
import { ProviderType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import { isLastRunExpired } from '@fishbot/utils/helpers/lastRunChecks/lastRunChecks';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';

const forexSymbols = ['AUDUSD', 'EURUSD', 'GBPUSD', 'NZDUSD', 'USDCAD', 'USDCHF', 'USDJPY'];
const cryptoSymbols = ['BTCUSD', 'ETHUSD'];

const watchingProviderTypeSymbols = {
  [ProviderType.icmarkets]: forexSymbols,
  [ProviderType.exness]: [...forexSymbols, ...cryptoSymbols],
};

const adminProviderIds = {
  [ProviderType.icmarkets]: 'earth',
  [ProviderType.exness]: 'earth2',
  roboforex: 'earth3',
  alpari: 'earth4',
};

const runs = {};

const priceGetMany = async ({ data, userInfo }: {
  data: {
    providerType: ProviderType,
    symbols: string[],
    reload?: boolean,
  },
  userInfo: User,
}) => {
  const { providerType, symbols, reload } = data;
  if (!providerType || !symbols?.length) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const isWatching = () => {
    const watchingSymbols = watchingProviderTypeSymbols[providerType];
    if (!watchingSymbols) return false;

    if (providerType === ProviderType.exness
      && _.difference(symbols, watchingSymbols).length) return false;

    return true;
  };
  if (isWatching()) {
    const prices = await getPrices(providerType, symbols);
    const result = Object.values(prices);
    return { result };
  }

  if (!reload
    && !isLastRunExpired({
      runs,
      runId: providerType,
      timeUnit: 'seconds',
      timeAmt: 60,
      checkIds: symbols,
    })
  ) return { result: [] };

  Logger.debug('Reload symbols', providerType, symbols);

  const providerId = adminProviderIds[providerType];
  const account = await getProvider(providerId);
  if (!account?.config) {
    return { error: ErrorType.badRequest };
  }

  // TODO: this is hardcode for metatrader
  const pricePromises = symbols.map(async (symbol) => {
    const priceSlim = await getSymbolTick({
      providerType,
      symbol,
      config: account.config,
    });
    return {
      ...priceSlim,
      providerType,
      symbol,
    };
  });
  const prices = await runPromises(pricePromises, {
    name: providerType,
    concurrency: 3,
  });

  return { result: prices };
};

export default priceGetMany;
