import { createConnection, destroyConnection } from '~dev/utils';
import getAccountList from './getAccountList';
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
test('getAccountList', async () => {
    try {
        await getAccountList(connection, 'invalidAccessToken');
        fail('Expected error');
    }
    catch (err) {
        Logger.debug('Handled error', err.message);
        expect(err.message).toContain('CH_ACCESS_TOKEN_INVALID');
    }
});
