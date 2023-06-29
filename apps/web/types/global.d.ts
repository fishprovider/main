import type { Workbox } from 'workbox-window';

interface LoggerType {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

declare global {
  interface Window {
    ApiLogFunc: (...args: any[]) => void;
    StoreLogFunc: (...args: any[]) => void;
    StoreLogFuncDebug: (...args: any[]) => void;

    workbox: Workbox;
    google: {
      translate: any; // google translate
    };
    fcWidget: any; // freshchat widget

    BuyWithCrypto: any // Coinbase Commerce widget
  }

  /* eslint-disable vars-on-top, no-var */
  var Logger: LoggerType;
  /* eslint-enable */
}

export {};
