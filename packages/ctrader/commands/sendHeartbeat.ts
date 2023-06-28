import type { ConnectionType } from '~types/Connection.model';

const sendHeartbeat = async (connection: ConnectionType) => {
  await connection.sendGuaranteedCommand({
    name: 'ProtoHeartbeatEvent',
    payload: {},
  });
  return true;
};

export default sendHeartbeat;
