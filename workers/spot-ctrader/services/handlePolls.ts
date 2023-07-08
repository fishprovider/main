import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { SymbolCTrader } from '@fishprovider/swap/types/Symbol.model';

const stopPolls = async (connection: ConnectionType) => {
  console.log('stopPolls', connection);
};

const startPolls = async (connection: ConnectionType, symbols: SymbolCTrader[]) => {
  console.log('startPolls', connection, symbols);
};

export { startPolls, stopPolls };
