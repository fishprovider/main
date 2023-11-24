import io from 'socket.io-client';

import { getUserInfoController, updateUserInfoController } from '~controllers/user.controller';
import { isLive } from '~utils';

const env = {
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || '',
  demoSocketUrl: process.env.NEXT_PUBLIC_DEMO_SOCKET_URL || '',
  socketTransports: process.env.NEXT_PUBLIC_SOCKET_TRANSPORTS || 'websocket,polling,webtransport',
  socketHeartbeat: process.env.NEXT_PUBLIC_SOCKET_HEARTBEAT,
};

const connectSocket = async () => {
  const { socket: socketCheck } = getUserInfoController();
  if (socketCheck) {
    Logger.warn('[socket] Already connected');
    return;
  }

  Logger.debug('[socket] Connecting...');
  const socket = io(isLive ? env.socketUrl : env.demoSocketUrl, {
    transports: env.socketTransports.split(','),
  });
  updateUserInfoController({ socket });

  socket.on('error', (error: any) => {
    console.error('[socket] Error', error);
    Logger.error('[socket] Error', error);
    updateUserInfoController({ socket: undefined });
  });

  if (env.socketHeartbeat) {
    Logger.info('[socket] Ping...');
    socket.on('ping', console.log);
  }
};

const disconnectSocket = () => {
  const { socket } = getUserInfoController();
  if (!socket) return;

  Logger.debug('[socket] Disconnecting...');
  updateUserInfoController({ socket: undefined });
  socket.disconnect();
};

export { connectSocket, disconnectSocket };
