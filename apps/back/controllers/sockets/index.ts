import { ErrorType } from '@fishprovider/utils/constants/error';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { User } from '@fishprovider/utils/types/User.model';
import type { Socket } from 'socket.io';

const env = {
  socketHeartbeat: process.env.SOCKET_HEARTBEAT,
  socketHeartbeatInterval: process.env.SOCKET_HEARTBEAT_INTERVAL || 10000,
};

const authRoom = (room: string, userInfo?: Partial<User>) => {
  const { uid, roles } = userInfo || {};

  if (room.startsWith('price-')) {
    return !!uid;
  }

  if (room.startsWith('account-')
    || room.startsWith('liveOrders-')
    || room.startsWith('pendingOrders-')
    || room.startsWith('historyOrders-')
  ) {
    const providerId = room.split('-')[1];
    const { isViewerProvider } = getRoleProvider(roles, providerId);
    return !!isViewerProvider;
  }

  return false;
};

const socketMiddlewareHandler = async (socket: Socket, next: (err?: any) => void) => {
  const { userInfo } = socket.request.session || {};
  const { uid } = userInfo || {};
  if (uid) {
    next();
  } else {
    next(new Error(ErrorType.accessDenied));
  }
};

const socketConnectHandler = async (socket: Socket) => {
  if (env.socketHeartbeat) {
    console.log('Start ping...');
    setInterval(() => {
      socket.emit('ping', new Date().toString());
    }, +env.socketHeartbeatInterval);
  }

  const { userInfo } = socket.request.session || {};
  Logger.debug(`[socket] Connected ${socket.id}, ${userInfo?.uid}`);

  socket.on('join', (room: string) => {
    Logger.debug(`[socket] Room joined ${room} ${socket.id}, ${userInfo?.uid}`);
    if (authRoom(room, userInfo)) {
      socket.join(room);
    } else {
      socket.emit('error', ErrorType.accessDenied);
    }
  });

  socket.on('leave', (room: string) => {
    Logger.debug(`[socket] Room left ${room} ${socket.id}, ${userInfo?.uid}`);
    socket.leave(room);
  });
};

const socketDisconnectHandler = (socket: Socket) => {
  const { userInfo } = socket.request.session || {};
  Logger.debug(`[socket] Disconnected ${socket.id}, ${userInfo?.uid}`);
};

export { socketConnectHandler, socketDisconnectHandler, socketMiddlewareHandler };
