import getAccountInfoSpot from '~commands/getAccountInfoSpot';

import { createConnection } from './utils';

const start = async () => {
  const connection = await createConnection();
  const result = await getAccountInfoSpot(connection);
  console.log('getAccountInfoSpot', result);
};

export {
  start,
};
