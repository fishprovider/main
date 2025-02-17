import subBar from '@fishprovider/ctrader/dist/commands/subBar';
import subSpot from '@fishprovider/ctrader/dist/commands/subSpot';
import unsubBar from '@fishprovider/ctrader/dist/commands/unsubBar';
import unsubSpot from '@fishprovider/ctrader/dist/commands/unsubSpot';
import { TrendbarPeriod } from '@fishprovider/ctrader/dist/constants/openApi';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import type { SymbolCTrader } from '@fishprovider/swap/dist/types/Symbol.model';
import delay from '@fishprovider/utils/dist/helpers/delay';

import { periods, spotTasks } from '~utils/tasks';

const maxRequestPerSec = 50;

const stopSubs = async (connection: ConnectionType, allSymbols: SymbolCTrader[]) => {
  Logger.info(`Unsubscribing ${allSymbols.length} symbols`);
  for (const { symbol, symbolId } of allSymbols) {
    // await unsubDepth(connection, symbolId)
    //   .catch((error) => Logger.debug(`Failed to unsubDepth ${symbol}`, error));
    if (spotTasks.bar) {
      for (const period of periods) {
        await unsubBar(connection, symbolId, TrendbarPeriod[period as keyof typeof TrendbarPeriod])
          .catch((error) => Logger.debug(`Failed to unsubBar ${symbol}`, error));
      }
    }
    if (spotTasks.price || spotTasks.bar) {
      await unsubSpot(connection, symbolId)
        .catch((error) => Logger.debug(`Failed to unsubSpot ${symbol}`, error));
    }

    await delay(1000 / +maxRequestPerSec);
  }
  Logger.info(`Unsubscribed ${allSymbols.length} symbols`);
};

const startSubs = async (connection: ConnectionType, allSymbols: SymbolCTrader[]) => {
  Logger.info(`Subscribing ${allSymbols.length} symbols`);
  Logger.debug(`Subscribing ${allSymbols.map((item) => item.symbol)}`);
  let count = 0;
  for (const { symbol, symbolId } of allSymbols) {
    if (spotTasks.price || spotTasks.bar) {
      await subSpot(connection, symbolId)
        .catch((error) => Logger.debug(`Failed to subSpot ${symbol}`, error));
    }
    if (spotTasks.bar) {
      for (const period of periods) {
        await subBar(connection, symbolId, TrendbarPeriod[period as keyof typeof TrendbarPeriod])
          .catch((error) => Logger.debug(`Failed to subBar ${symbol}`, error));
      }
    }
    // await subDepth(connection, symbolId)
    //   .catch((error) => Logger.debug(`Failed to subDepth ${symbol}`, error));

    await delay(1000 / +maxRequestPerSec);

    count += 1;
    if (count % 10 === 0) {
      Logger.debug(`Subscribed ${count} symbols, ${allSymbols.length - count} remaining`);
    }
  }
  Logger.info(`Subscribed ${allSymbols.length} symbols`);
};

export { startSubs, stopSubs };
