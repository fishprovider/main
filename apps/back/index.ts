import { ProviderType } from '@fishbot/utils/constants/account';
import delay from '@fishbot/utils/helpers/delay';
import { getMajorPairs } from '@fishbot/utils/helpers/price';
import { config } from 'dotenv-flow';

const start = async () => {
  config();

  const majorPairs = getMajorPairs(ProviderType.exness);
  console.log(majorPairs);
  await delay(1000);
  console.log('done');
};
start();
