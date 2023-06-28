import * as app from '~controllers/app';
import beforeShutdown from '~controllers/beforeShutdown';
import * as agenda from '~libs/agenda';
import * as express from '~libs/express';
import * as firebase from '~libs/firebase';
import * as logger from '~libs/logger';
import * as mongo from '~libs/mongo';
import * as postgres from '~libs/postgres';
import * as rabbitmq from '~libs/rabbitmq';
import * as redis from '~libs/redis';
import type { Adapter } from '~types/Adapter.model';

process.setMaxListeners(0);

const env = {
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
  mongodbUri: process.env.MONGODB_URI,
  redisEnabled: process.env.REDIS_ENABLED,
  pgEnabled: process.env.PG_ENABLED,
  rabbitMqEnabled: process.env.RABBITMQ_ENABLED,
  api: process.env.API,
};

const startLogger = async () => {
  await logger.start();

  beforeShutdown(() => logger.destroy());
};

const startRedis = async () => {
  if (env.redisEnabled) {
    await redis.start();

    beforeShutdown(() => redis.destroy());
    Logger.info('Redis loaded');
  }
};

const startFirebase = async () => {
  if (env.firebasePrivateKey) {
    await firebase.start();

    beforeShutdown(() => firebase.destroy());
    Logger.info('Firebase loaded');
  }
};

const startMongo = async () => {
  if (env.mongodbUri) {
    await mongo.start();

    beforeShutdown(() => mongo.destroy());
    Logger.info('Mongo loaded');
  }
};

const startPostgres = async () => {
  if (env.pgEnabled) {
    await postgres.start();

    beforeShutdown(() => postgres.destroy());
    Logger.info('Postgres loaded');
  }
};

const startAgenda = async (adapter: Adapter) => {
  if (env.mongodbUri) {
    agenda.initialize();
    await agenda.start(adapter);

    beforeShutdown(() => agenda.destroy());
    Logger.info('Agenda loaded');
  }
};

const startRabbitMQ = async () => {
  if (env.rabbitMqEnabled) {
    await rabbitmq.start();

    beforeShutdown(() => rabbitmq.destroy());
    Logger.info('RabbitMQ loaded');
  }
};

const startExpress = async (adapter: Adapter) => {
  if (env.api) {
    await express.start(adapter);

    beforeShutdown(() => express.destroy());
    Logger.info('Express loaded');
  }
};

const startMain = async (adapter: Adapter) => {
  app.initialize(adapter);

  if (adapter.beforeShutdownHandlers) {
    adapter.beforeShutdownHandlers.forEach((handler) => {
      beforeShutdown((signalOrEvent) => handler(signalOrEvent));
    });
  }
  Logger.info('Adapter loaded');
};

const start = async (adapter: Adapter) => {
  try {
    await startLogger();
    await Promise.all([
      startRedis(),
      startFirebase(),
      startMongo(),
      startPostgres(),
      startAgenda(adapter),
      startRabbitMQ(),
    ]);
    await startExpress(adapter);
    await startMain(adapter);
  } catch (err) {
    Logger.error(`🔥 Failed to start: ${err}`);
  }
};

const ready = () => {
  // send the ready signal to PM2 for the `reload` process
  if (process.send) {
    process.send('ready');
  }
};

const destroy = (adapter: Adapter) => {
  if (adapter.beforeShutdownHandlers) {
    adapter.beforeShutdownHandlers.map((handler) => handler());
  }
  if (env.api) {
    express.destroy();
  }
  if (env.rabbitMqEnabled) {
    rabbitmq.destroy();
  }
  if (env.pgEnabled) {
    postgres.destroy();
  }
  if (env.redisEnabled) {
    redis.destroy();
  }
  if (env.mongodbUri) {
    agenda.destroy();
    mongo.destroy();
  }
  if (env.firebasePrivateKey) {
    firebase.destroy();
  }
  logger.destroy();
};

const destroyAsync = async (adapter: Adapter) => {
  if (adapter.beforeShutdownHandlers) {
    await Promise.all(adapter.beforeShutdownHandlers.map((handler) => handler()));
  }
  if (env.api) {
    express.destroy();
  }
  if (env.rabbitMqEnabled) {
    rabbitmq.destroy();
  }
  if (env.pgEnabled) {
    postgres.destroy();
  }
  if (env.redisEnabled) {
    await redis.destroyAsync();
  }
  if (env.mongodbUri) {
    await agenda.destroyAsync();
    await mongo.destroyAsync();
  }
  if (env.firebasePrivateKey) {
    await firebase.destroyAsync();
  }
  await logger.destroyAsync();
};

export {
  destroy,
  destroyAsync,
  ready,
  start,
};
