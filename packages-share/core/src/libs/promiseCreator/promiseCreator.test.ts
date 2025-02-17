import { promiseCreator } from './promiseCreator';

test('promiseCreator', async () => {
  const val = 'test';
  const promise = promiseCreator<string>();

  setTimeout(() => {
    if (promise.resolveExec) promise.resolveExec(val);
  }, 100);

  const res = await promise;
  expect(res).toBe(val);
});
