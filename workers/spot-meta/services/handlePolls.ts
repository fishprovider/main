import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';

const stopPolls = async (connection: ConnectionType) => {
  console.log('stopPolls', connection);
};

const startPolls = async (connection: ConnectionType, symbols: string[]) => {
  console.log('startPolls', connection, symbols);
};

export { startPolls, stopPolls };
