import type { RedisClientType } from '@redis/client';
import _ from 'lodash';

let redisClient: RedisClientType | undefined;
const channels = [
  'price-*',
  'depth-*',
  'account-*',
  'liveOrders-*',
  'pendingOrders-*',
  'historyOrders-*',
];

const onMessage = (message: any, channel: string) => {
  if (!message || !channel) {
    Logger.warn(`Failed at onMessage ${message}, ${channel}`);
    return;
  }
  const [channelType, ...keys] = channel.split('-');
  const key = keys.join('-');

  switch (channelType) {
    case 'price':
    case 'depth': {
      const doc = JSON.parse(message);
      const room = `${channelType}-${key}`;
      SocketIO.to(room).emit(room, doc);
      break;
    }
    case 'account': {
      const doc = JSON.parse(message);
      const room = `${channelType}-${key}`;
      delete doc.config;
      SocketIO.to(room).emit(room, doc);
      break;
    }
    case 'liveOrders':
    case 'pendingOrders': {
      const orders = JSON.parse(message);
      const room = `${channelType}-${key}`;
      SocketIO.to(room).emit(room, orders);
      break;
    }
    case 'historyOrders': {
      const deals = JSON.parse(message);
      const providerId = keys[0];
      const room = `${channelType}-${providerId}`;
      SocketIO.to(room).emit(room, deals);
      break;
    }
    default:
      Logger.warn(`Unhandled channelType ${channelType}`);
  }
};

const start = async () => {
  redisClient = Redis.duplicate();
  redisClient.on('error', (error) => Logger.warn('Redis error', error));
  await redisClient.connect();

  Logger.debug(`Subscribing channels ${channels}`);
  redisClient.pSubscribe(channels, onMessage);
};

const destroy = async () => {
  if (redisClient) {
    Logger.debug(`Unsubscribe channels ${channels}`);
    await redisClient.pUnsubscribe(channels);
    redisClient = undefined;
  }
};

export {
  destroy,
  start,
};
