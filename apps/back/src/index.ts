import promiseCreator from '@fishbot/utils/dist/helpers/promiseCreator';
import { config } from 'dotenv-flow';

const start = () => {
  config();

  console.log('Hello world');

  const foo = promiseCreator();
  (async () => {
    const res = await foo;
    console.log('foo', res);
  })();
  foo.resolveExec('bar');
};
start();
