import type { Agenda } from 'agenda';

interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare global {
  let Logger: LoggerType;
  let Agenda: Agenda;
}

export {};
