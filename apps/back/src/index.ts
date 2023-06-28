import { parseCopyId } from '@fishbot/utils/helpers/order';
import { config } from 'dotenv-flow';

const start = () => {
  config();

  console.log('Hello world');

  parseCopyId('aaa!bbb!ccc');
};
start();
