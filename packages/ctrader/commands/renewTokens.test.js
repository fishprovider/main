import { createConnection, destroyConnection } from '~dev/utils';
import renewTokens from './renewTokens';
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
test('Invalid Refresh Token', async () => {
    try {
        await renewTokens(connection, 'invalidRefreshToken');
        fail('Expected error');
    }
    catch (err) {
        Logger.debug('Handled error', err.message);
        expect(err.message).toContain('CH_ACCESS_TOKEN_INVALID');
    }
});
