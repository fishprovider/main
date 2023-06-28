import type { Session } from '@fishbot/swap/types/Session.model';
import type { RedisClientType } from '@redis/client';
import type { Agenda } from 'agenda';
import type { app as FirebaseApp } from 'firebase-admin';
import type { Db as MongoDb } from 'mongodb';
import type { Server as SocketServer } from 'socket.io';

interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare module 'http' {
  interface IncomingMessage {
    session: Session
  }
}

declare global {
  let Logger: LoggerType;
  let Redis: RedisClientType;
  let Firebase: FirebaseApp.App;
  let Mongo: MongoDb;
  let Agenda: Agenda;
  let SocketIO: SocketServer;
}

export {};
