import type { Channel, Connection } from 'amqplib/callback_api';
import { connect } from 'amqplib/callback_api';

const env = {
  url: process.env.RABBITMQ_URL || '',
  type: process.env.RABBITMQ_TYPE,
};

let _connection: Connection | undefined;

const _channels: { pub?: Channel; sub?: Channel } = {};

const createChannel = async (connection: Connection) => {
  const channel = await new Promise<Channel>((resolve, reject) => {
    connection.createChannel((err, ch) => {
      if (err) {
        Logger.error('Failed to create channel RabbitMQ', err);
        reject(err);
      } else {
        resolve(ch);
      }
    });
  });
  return channel;
};

const startPub = async (connection: Connection) => {
  if (env.type === 'pub' || env.type === 'pubsub') {
    _channels.pub = await createChannel(connection);
  }
};

const startSub = async (connection: Connection) => {
  if (env.type === 'sub' || env.type === 'pubsub') {
    _channels.sub = await createChannel(connection);
  }
};

const start = async () => {
  _connection = await new Promise<Connection>((resolve, reject) => {
    connect(env.url, (err, conn) => {
      if (err) {
        Logger.error(`Failed to connect to RabbitMQ at ${env.url}`, err);
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });

  await Promise.all([startPub(_connection), startSub(_connection)]);

  global.RabbitMQ = _channels;
};

const destroy = () => {
  console.log('RabbitMQ destroying...');

  Object.values(_channels).forEach((channel) => channel?.close((err) => {
    console.log(`Failed to close channel RabbitMQ: ${err}`);
  }));
  delete _channels.pub;
  delete _channels.sub;

  if (_connection) {
    _connection.close();
    _connection = undefined;
  }

  console.log('RabbitMQ destroyed');
};

export {
  destroy,
  start,
};
