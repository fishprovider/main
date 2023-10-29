import { jest } from '@jest/globals';

import { log, LogHandler, registerCustomHandlers } from './log';

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
