import subSpot from '@fishprovider/metatrader/commands/subSpot';
import unsubSpot from '@fishprovider/metatrader/commands/unsubSpot';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import delay from '@fishprovider/utils/helpers/delay';

import { spotTasks } from '~utils/tasks';

const maxRequestPerSec = 50;

const stopSubs = async (connection: ConnectionType, symbols: string[]) => {
  Logger.info(`Unsubscribing ${symbols.length} symbols`);
  for (const symbol of symbols) {
    if (spotTasks.price) {
      await unsubSpot(connection, symbol)
        .catch((error) => Logger.debug(`Failed to unsubSpot ${symbol}`, error));
    }

    await delay(1000 / +maxRequestPerSec);
  }
  Logger.info(`Unsubscribed ${symbols.length} symbols`);
};

const startSubs = async (connection: ConnectionType, symbols: string[]) => {
  Logger.info(`Subscribing ${symbols.length} symbols`);
  Logger.debug(`Subscribing ${symbols.map((symbol) => symbol)}`);
  let count = 0;
  for (const symbol of symbols) {
    if (spotTasks.price) {
      // await subSpot(connection, symbol)
      subSpot(connection, symbol)
        .catch((error) => Logger.debug(`Failed to subSpot ${symbol}`, error));
    }

    await delay(1000 / +maxRequestPerSec);

    count += 1;
    if (count % 10 === 0) {
      Logger.debug(`Subscribed ${count} symbols, ${symbols.length - count} remaining`);
    }
  }
  Logger.info(`Subscribed ${symbols.length} symbols`);
};

export { startSubs, stopSubs };
