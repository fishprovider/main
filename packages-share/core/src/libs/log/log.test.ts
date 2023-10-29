import { jest } from '@jest/globals';

import { log, LogHandler, registerCustomHandlers } from './log';

describe('log', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'info').mockImplementation(() => undefined);
    jest.spyOn(console, 'debug').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
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
