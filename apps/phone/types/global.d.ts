interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare global {
  /* eslint-disable vars-on-top, no-var */
  var Logger: LoggerType;
  /* eslint-enable */
}

export {};
