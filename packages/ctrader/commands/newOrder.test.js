import newOrder from '~commands/newOrder';
import { OrderType, TradeSide } from '~constants/openApi';
import { createConnection, destroyConnection } from '~dev/utils';
import delay from '~utils/delay';
import { isMarketClosed } from '~utils/validate';
import cancelOrder from './cancelOrder';
import closePosition from './closePosition';
import getSymbolList from './getSymbolList';
import updateOrder from './updateOrder';
import updatePosition from './updatePosition';
let connection;
let symbolId = '';
beforeAll((done) => {
    (async () => {
        try {
            connection = await createConnection();
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
test('[Limit Order] newOrder - updateOrder - cancelOrder', async () => {
    expect(connection).toBeDefined();
    const comment = 'test-comment';
    const volume = 1000;
    let orderId;
    try {
        const { order } = await newOrder(connection, symbolId, OrderType.LIMIT, TradeSide.BUY, volume, {
            limitPrice: 0.1,
            comment,
        });
        expect(order).toBeDefined();
        if (!order) {
            fail('order is not defined');
        }
        orderId = order.orderId;
        await delay(1000);
        await updateOrder(connection, orderId, {
            volume: 2000,
            limitPrice: 0.2,
            stopLoss: 0.1,
            takeProfit: 0.3,
        });
    }
    finally {
        if (orderId) {
            await cancelOrder(connection, orderId);
        }
    }
});
test('[Market Order] newOrder - updatePosition - closePosition', async () => {
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
        positionId = position.positionId;
        await delay(1000);
        await updatePosition(connection, positionId, {
            stopLoss: 0.1,
            takeProfit: 2,
        });
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
