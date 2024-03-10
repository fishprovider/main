import { jest } from '@jest/globals';

import { log, LogHandler, registerCustomHandlers } from './log';

const consoleErrorSpy = jest.spyOn(console, 'error');
const consoleWarnSpy = jest.spyOn(console, 'warn');
const consoleInfoSpy = jest.spyOn(console, 'info');
const consoleDebugSpy = jest.spyOn(console, 'debug');
const consoleLogSpy = jest.spyOn(console, 'log');

describe('log', () => {
  beforeEach(() => {
    consoleErrorSpy.mockImplementation(() => undefined);
    consoleWarnSpy.mockImplementation(() => undefined);
    consoleInfoSpy.mockImplementation(() => undefined);
    consoleDebugSpy.mockImplementation(() => undefined);
    consoleLogSpy.mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('registerCustomHandlers', async () => {
    const customHandler = jest.fn<LogHandler>();

    registerCustomHandlers(({
      debug: customHandler,
      info: customHandler,
      warn: customHandler,
      error: customHandler,
    }));

    log.setLevel('debug');

    log.debug('debug');
    expect(customHandler).toBeCalledTimes(1);
    log.info('info');
    expect(customHandler).toBeCalledTimes(2);
    log.warn('warn');
    expect(customHandler).toBeCalledTimes(3);
    log.error('error');
    expect(customHandler).toBeCalledTimes(4);
  });
});
