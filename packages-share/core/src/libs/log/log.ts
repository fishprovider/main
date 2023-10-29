import loglevel, { LogLevelNames } from 'loglevel';

type Message = Error | object | string;
export type LogHandler = (...messages: Message[]) => void | Promise<void>;

// error > warn > info > debug
loglevel.setLevel('info');

export const setLogLevel = (level: LogLevelNames) => {
  loglevel.setLevel(level);
};

export const registerCustomHandlers = (
  handlers: Partial<Record<LogLevelNames, LogHandler>> = {},
) => {
  const originalFactory = loglevel.methodFactory;
  loglevel.methodFactory = (levelName, level, loggerName) => {
    const originHandler = originalFactory(levelName, level, loggerName);
    return async (...messages) => {
      originHandler(...messages);
      const customHandler = handlers[levelName];
      if (customHandler) {
        await customHandler(...messages);
      }
    };
  };
};

export const log = loglevel;
