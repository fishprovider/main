import type { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

const env = {
  type: process.env.TYPE,
  typeId: process.env.TYPE_ID,

  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
  redisKey: process.env.REDIS_KEY,
};

let _clients: RedisClientType[] = [];

const start = async () => {
  const client = createClient({
    name: `${env.type}-${env.typeId}`,
    url: `redis://${env.redisHost}:${env.redisPort}`,
    ...(env.redisKey && { password: env.redisKey }),
  }) as RedisClientType;

  _clients.push(client);

  client.on('error', (error) => Logger.error('Redis error', error));

  await client.connect();

  global.Redis = client;
};

const destroy = () => {
  console.log(`Redis destroying... ${_clients.length} clients`);
  _clients.forEach((client) => {
    client.quit().catch((err) => {
      if (err) console.error(err);
    });
  });
  _clients = [];
  console.log('Redis destroyed');
};

const destroyAsync = async () => {
  console.log(`Redis destroying... ${_clients.length} clients`);
  await Promise.all(
    _clients.map((client, index) => client.quit().catch((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Redis destroyed client ${index}`);
      }
    })),
  );
  _clients = [];
  console.log('Redis destroyed');
};

export { destroy, destroyAsync, start };
