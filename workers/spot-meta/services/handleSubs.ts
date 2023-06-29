import subSpot from '@fishbot/metatrader/commands/subSpot';
import unsubSpot from '@fishbot/metatrader/commands/unsubSpot';
import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';
import delay from '@fishbot/utils/helpers/delay';

import { spotTasks } from '~utils/tasks';

const maxRequestPerSec = 50;

const stopSubs = async (connection: ConnectionType, allSymbols: string[]) => {
  Logger.info(`Unsubscribing ${allSymbols.length} symbols`);
  for (const symbol of allSymbols) {
    if (spotTasks.price) {
      await unsubSpot(connection, symbol)
        .catch((error) => Logger.debug(`Failed to unsubSpot ${symbol}`, error));
    }

    await delay(1000 / +maxRequestPerSec);
  }
  Logger.info(`Unsubscribed ${allSymbols.length} symbols`);
};

const startSubs = async (connection: ConnectionType, allSymbols: string[]) => {
  Logger.info(`Subscribing ${allSymbols.length} symbols`);
  Logger.debug(`Subscribing ${allSymbols.map((symbol) => symbol)}`);
  let count = 0;
  for (const symbol of allSymbols) {
    if (spotTasks.price) {
      // await subSpot(connection, symbol)
      subSpot(connection, symbol)
        .catch((error) => Logger.debug(`Failed to subSpot ${symbol}`, error));
    }

    await delay(1000 / +maxRequestPerSec);

    count += 1;
    if (count % 10 === 0) {
      Logger.debug(`Subscribed ${count} symbols, ${allSymbols.length - count} remaining`);
    }
  }
  Logger.info(`Subscribed ${allSymbols.length} symbols`);
};

export { startSubs, stopSubs };
