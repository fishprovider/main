interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare global {
  let Logger: LoggerType;

  interface Window {
    ApiLogFunc: (...args: any[]) => void;
    StoreLogFunc: (...args: any[]) => void;
    StoreLogFuncDebug: (...args: any[]) => void;
  }
}

export {};
