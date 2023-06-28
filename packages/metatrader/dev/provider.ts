import getAccountInformation from '~commands/getAccountInformation';
import startAccount from '~commands/startAccount';

import { createConnection } from './utils';

const start = async () => {
  const connection = await createConnection();
  await connection.start();
  await startAccount(connection);
  const result = await getAccountInformation(connection);
  console.log('getAccountInformation', result);
};

export {
  start,
};
