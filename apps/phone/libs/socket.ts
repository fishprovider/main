import storeUser from '@fishprovider/cross/dist/stores/user';
import io from 'socket.io-client';

const env = {
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || '',
  socketTransports: process.env.EXPO_PUBLIC_SOCKET_TRANSPORTS || 'websocket,polling,webtransport',
  socketHeartbeat: process.env.EXPO_PUBLIC_SOCKET_HEARTBEAT,
};

const connectSocket = async () => {
  const { socket: socketCheck } = storeUser.getState();
  if (socketCheck) {
    return;
  }

  const socket = io(env.socketUrl, {
    transports: env.socketTransports.split(','),
  });
  storeUser.mergeState({ socket });

  socket.on('error', (error: any) => {
    console.error('[socket] Error', error);
    storeUser.mergeState({ socket: undefined });
  });

  if (env.socketHeartbeat) {
    socket.on('ping', console.log);
  }
};

const disconnectSocket = () => {
  const { socket } = storeUser.getState();
  if (!socket) return;

  storeUser.mergeState({ socket: undefined });
  socket.disconnect();
};

export { connectSocket, disconnectSocket };
