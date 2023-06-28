import getAccountInformation from '~commands/getAccountInformation';
import { createConnection } from './utils';
const start = async () => {
    const connection = await createConnection();
    const result = await getAccountInformation(connection);
    console.log('getAccountInformation', result);
};
export { start, };
