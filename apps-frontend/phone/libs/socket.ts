import storeUser from '@fishprovider/cross/dist/stores/user';
import io from 'socket.io-client';

let socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || '';

const updateSocketUrl = (url = '') => {
  socketUrl = url;
};

const connectSocket = async () => {
  const { socket: socketCheck } = storeUser.getState();
  if (socketCheck) {
    return;
  }

  const socket = io(socketUrl, {
    transports: (process.env.EXPO_PUBLIC_SOCKET_TRANSPORTS || 'websocket,polling,webtransport').split(','),
  });
  storeUser.mergeState({ socket });

  socket.on('error', (error: any) => {
    Logger.error('[socket] Error', error);
    storeUser.mergeState({ socket: undefined });
  });

  if (process.env.EXPO_PUBLIC_SOCKET_HEARTBEAT) {
    socket.on('ping', Logger.debug);
  }
};

const disconnectSocket = () => {
  const { socket } = storeUser.getState();
  if (!socket) return;

  storeUser.mergeState({ socket: undefined });
  socket.disconnect();
};

export { connectSocket, disconnectSocket, updateSocketUrl };
