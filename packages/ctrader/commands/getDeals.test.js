import moment from 'moment';
import getDeals from '~commands/getDeals';
import { createConnection, destroyConnection } from '~dev/utils';
let connection;
beforeAll((done) => {
    (async () => {
        try {
            connection = await createConnection();
        }
        catch (err) {
            Logger.error('Failed to connect', err);
        }
        finally {
            done();
        }
    })();
});
afterAll((done) => {
    (async () => {
        try {
            await destroyConnection(connection);
        }
        catch (err) {
            Logger.error('Failed to destroy', err);
        }
        finally {
            done();
        }
    })();
});
test('getDeals', async () => {
    expect(connection).toBeDefined();
    const from = moment().subtract(1, 'd').unix() * 1000;
    const to = moment().unix() * 1000;
    const result = await getDeals(connection, from, to);
    expect(result).toBeDefined();
});
