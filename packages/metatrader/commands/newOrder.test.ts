import { ActionType } from '~constants/metaApi';
import { createConnection, destroyConnection } from '~dev/utils';
import type { ConnectionType } from '~types/Connection.model';
import { isMarketClosed } from '~utils/validate';

import cancelOrder from './cancelOrder';
import closePosition from './closePosition';
import newOrder from './newOrder';
import updateOrder from './updateOrder';
import updatePosition from './updatePosition';

let connection: ConnectionType;

beforeAll((done) => {
  (async () => {
    try {
      connection = await createConnection();
    } catch (err) {
      Logger.error('Failed to connect', err);
    } finally {
      done();
    }
  })();
});

afterAll((done) => {
  (async () => {
    try {
      await destroyConnection(connection);
    } catch (err) {
      Logger.error('Failed to destroy', err);
    } finally {
      done();
    }
  })();
});

test('[Limit Order] newOrder - updateOrder - cancelOrder', async () => {
  expect(connection).toBeDefined();

  const comment = 'test-comment';

  let orderId: string | undefined;
  try {
    const result = await newOrder(
      connection,
      {
        symbol: 'ETHUSD',
        actionType: ActionType.ORDER_TYPE_BUY_LIMIT,
        lot: 0.1,
        openPrice: 10,
        comment,
      },
    );
    expect(result).toBeDefined();
    if (isMarketClosed(result.stringCode)) {
      Logger.warn('Market closed');
      return;
    }
    expect(result.orderId).toBeDefined();
    orderId = result?.orderId;

    const resultUpdate = await updateOrder(connection, orderId, {
      openPrice: 20,
      stopLoss: 5,
      takeProfit: 100,
    });
    expect(resultUpdate.orderId).toBeDefined();
  } finally {
    if (orderId) {
      const resultCancel = await cancelOrder(connection, orderId);
      expect(resultCancel.orderId).toBeDefined();
    }
  }
});

test('[Market Order] newOrder - updatePosition - closePosition', async () => {
  expect(connection).toBeDefined();

  const comment = 'test-comment';

  let positionId: string | undefined;
  try {
    const result = await newOrder(
      connection,
      {
        symbol: 'ETHUSD',
        actionType: ActionType.ORDER_TYPE_BUY,
        lot: 0.1,
        comment,
      },
    );
    expect(result).toBeDefined();
    if (isMarketClosed(result.stringCode)) {
      Logger.warn('Market closed');
      return;
    }
    expect(result.positionId).toBeDefined();
    positionId = result.positionId;

    const resultUpdate = await updatePosition(connection, positionId, {
      stopLoss: 5,
      takeProfit: 10000,
    });
    expect(resultUpdate.positionId).toBeDefined();
  } finally {
    if (positionId) {
      const resultClose = await closePosition(connection, positionId);
      expect(resultClose.positionId).toBeDefined();
    }
  }
});
