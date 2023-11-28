import io from 'socket.io-client';

import { getUserInfoController, updateUserInfoController } from '~controllers/user.controller';

let socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || '';

const updateSocketUrl = (url = '') => {
  socketUrl = url;
};

const connectSocket = async () => {
  const { socket: socketCheck } = getUserInfoController();
  if (socketCheck) {
    return;
  }

  const socket = io(socketUrl, {
    transports: (process.env.EXPO_PUBLIC_SOCKET_TRANSPORTS || 'websocket,polling,webtransport').split(','),
  });
  updateUserInfoController({ socket });

  socket.on('error', (error: any) => {
    Logger.error('[socket] Error', error);
    updateUserInfoController({ socket: undefined });
  });

  if (process.env.EXPO_PUBLIC_SOCKET_HEARTBEAT) {
    socket.on('ping', Logger.debug);
  }
};

const disconnectSocket = () => {
  const { socket } = getUserInfoController();
  if (!socket) return;

  updateUserInfoController({ socket: undefined });
  socket.disconnect();
};

export { connectSocket, disconnectSocket, updateSocketUrl };
