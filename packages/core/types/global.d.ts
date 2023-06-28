import type { RedisClientType } from '@redis/client';
import type { Agenda } from 'agenda';
import type { Channel as RabbitMqChannel } from 'amqplib/callback_api';
import type { app as FirebaseApp } from 'firebase-admin';
import type { Db as MongoDb, MongoClient } from 'mongodb';
import type { Pool } from 'pg';
import type { Server as SocketServer } from 'socket.io';

interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare global {
  /* eslint-disable vars-on-top, no-var */
  var Logger: LoggerType;
  var Redis: RedisClientType;
  var Firebase: FirebaseApp.App;
  var MongoConnection: MongoClient;
  var Mongo: MongoDb;
  var Agenda: Agenda;
  var RabbitMQ: { pub?: RabbitMqChannel; sub?: RabbitMqChannel };
  var SocketIO: SocketServer;
  var Postgres: { pool: Pool };
}

export {};
