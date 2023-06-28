import { jest } from '@jest/globals';
import _ from 'lodash';
import closePosition from '~commands/closePosition';
import getSymbolList from '~commands/getSymbolList';
import newOrder from '~commands/newOrder';
import { ExecutionType, OrderType, PayloadType, TradeSide, } from '~constants/openApi';
import { createConnection, destroyConnection } from '~dev/utils';
import delay from '~utils/delay';
import promiseCreator from '~utils/promiseCreator';
import { isMarketClosed } from '~utils/validate';
import * as handleEventOrder from './order';
let connection;
let symbolId = '';
const onEvent = jest.fn();
beforeAll((done) => {
    (async () => {
        try {
            connection = await createConnection(onEvent);
            const { symbols } = await getSymbolList(connection);
            const symbol = symbols.find(({ symbolName }) => symbolName === 'EURUSD');
            symbolId = symbol?.symbolId || '';
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
beforeEach(() => {
    jest.restoreAllMocks();
    onEvent.mockRestore();
});
test.skip('[Event] New market order, receive ExecutionType ORDER_FILLED', async () => {
    expect(connection).toBeDefined();
    const comment = 'test-comment';
    const volume = 1000;
    let positionId;
    try {
        const promise = promiseCreator();
        const spy = jest.spyOn(handleEventOrder, 'default');
        onEvent.mockImplementation((callbackPayload) => {
            const { payloadType, executionType, position } = callbackPayload;
            Logger.debug('Got event', _.invert(PayloadType)[payloadType], _.invert(ExecutionType)[executionType]);
            if (payloadType === PayloadType.PROTO_OA_EXECUTION_EVENT
                && executionType === ExecutionType.ORDER_FILLED
                && position?.comment === comment) {
                promise.resolveExec();
            }
        });
        const { position } = await newOrder(connection, symbolId, OrderType.MARKET, TradeSide.BUY, volume, {
            comment,
        });
        expect(position).toBeDefined();
        if (!position) {
            fail('position is not defined');
        }
        Logger.debug(`Position created: ${position.positionId}`);
        positionId = position.positionId;
        await promise;
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(expect.objectContaining({
            payloadType: PayloadType.PROTO_OA_EXECUTION_EVENT,
            executionType: ExecutionType.ORDER_FILLED,
        }), expect.anything());
    }
    catch (err) {
        if (isMarketClosed(err?.message)) {
            Logger.warn('Market is closed');
        }
        else {
            throw err;
        }
    }
    finally {
        if (positionId) {
            await closePosition(connection, positionId, volume);
        }
    }
});
test.skip('[Event] Close market order, receive ExecutionType ORDER_FILLED', async () => {
    expect(connection).toBeDefined();
    const comment = 'test-comment';
    const volume = 1000;
    let positionId;
    try {
        const { position } = await newOrder(connection, symbolId, OrderType.MARKET, TradeSide.BUY, volume, {
            comment,
        });
        expect(position).toBeDefined();
        if (!position) {
            fail('position is not defined');
        }
        Logger.debug(`Position created: ${position.positionId}`);
        positionId = position.positionId;
        await delay(1000);
        const promise = promiseCreator();
        const spy = jest.spyOn(handleEventOrder, 'default');
        onEvent.mockImplementation((callbackPayload) => {
            const { payloadType, executionType, position: positionClose } = callbackPayload;
            Logger.debug('Got event', _.invert(PayloadType)[payloadType], _.invert(ExecutionType)[executionType]);
            if (payloadType === PayloadType.PROTO_OA_EXECUTION_EVENT
                && executionType === ExecutionType.ORDER_FILLED
                && positionClose?.comment === comment) {
                promise.resolveExec();
            }
        });
        await closePosition(connection, positionId, volume);
        positionId = undefined;
        await promise;
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(expect.objectContaining({
            payloadType: PayloadType.PROTO_OA_EXECUTION_EVENT,
            executionType: ExecutionType.ORDER_FILLED,
        }), expect.anything());
    }
    catch (err) {
        if (isMarketClosed(err?.message)) {
            Logger.warn('Market is closed');
        }
        else {
            throw err;
        }
    }
    finally {
        if (positionId) {
            await closePosition(connection, positionId, volume);
        }
    }
});
