import getAllPositionsAndOrders from '~commands/getAllPositionsAndOrders';
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
test('getAllPositionsAndOrders', async () => {
    expect(connection).toBeDefined();
    const result = await getAllPositionsAndOrders(connection);
    expect(result).toBeDefined();
});
