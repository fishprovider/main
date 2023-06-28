import { createConnection, destroyConnection, getConfig, renewTokens, } from '~dev/utils';
import authorizeAccount from './authorizeAccount';
let connection;
beforeEach((done) => {
    (async () => {
        try {
            connection = await createConnection(undefined, {
                accountId: undefined,
                accessToken: undefined,
                refreshToken: undefined,
            });
        }
        catch (err) {
            Logger.error('Failed to connect', err);
        }
        finally {
            done();
        }
    })();
});
afterEach((done) => {
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
test('Invalid Access Token', async () => {
    try {
        const config = await getConfig();
        const { accountId } = config;
        await authorizeAccount(connection, 'invalidAccessToken', accountId);
        fail('Expected error');
    }
    catch (err) {
        Logger.debug('Handled error', err.message);
        expect(err.message).toContain('CH_ACCESS_TOKEN_INVALID');
    }
});
test('Double authorizeAccount', async () => {
    try {
        const config = await getConfig();
        const { accountId, accessToken } = config;
        await authorizeAccount(connection, accessToken, accountId);
        await authorizeAccount(connection, accessToken, accountId);
        fail('Expected error');
    }
    catch (err) {
        Logger.debug('Handled error', err.message);
        expect(err.message).toContain('ALREADY_LOGGED_IN');
    }
});
test('Re-authorizeAccount', async () => {
    const config = await getConfig();
    const { accountId, accessToken, refreshToken } = config;
    await authorizeAccount(connection, accessToken, accountId);
    if (!refreshToken)
        fail('Expected refreshToken');
    const tokens = await renewTokens(connection, refreshToken);
    await authorizeAccount(connection, tokens.accessToken, accountId);
    Logger.debug(`Re-authorized account ${accountId}`);
});
