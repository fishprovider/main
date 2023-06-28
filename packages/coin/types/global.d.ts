import type { RedisClientType } from '@redis/client';
import type { Agenda } from 'agenda';
import type { app as FirebaseApp } from 'firebase-admin';
import type { Db as MongoDb, MongoClient } from 'mongodb';

interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare global {
  let Logger: LoggerType;
  let Redis: RedisClientType;
  let Firebase: FirebaseApp.App;
  let MongoConnection: MongoClient;
  let Mongo: MongoDb;
  let Agenda: Agenda;
}

export {};
