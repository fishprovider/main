import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import updateOrder from '~commands/updateOrder';
import updatePosition from '~commands/updatePosition';
import {
  afterAllSetup, beforeAllSetup, checkOrder, getConfig, testLimitOrder, testMarketOrder,
} from '~tests/utils';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

describe('newOrder', () => {
  test('ctrader limit', async () => {
    const config = await getConfig('ctrader');
    await testLimitOrder(
      async ({ orderToNew, order }) => {
        Logger.info('Created order', order);
        checkOrder(order, orderToNew, OrderStatus.pending);

        const orderToUpdate = {
          ...order,
          config,
          limitPrice: 0.6,
          stopLoss: 0.5,
          takeProfit: 0.7,
          volume: 1000,
        };
        const orderUpdated = await updateOrder({
          order,
          options: orderToUpdate,
        });
        Logger.info('Updated order', orderUpdated);
        checkOrder(orderUpdated, orderToUpdate, OrderStatus.pending);
      },
      config,
      'ctrader',
      ProviderType.icmarkets,
    );
  });

  test('ctrader market', async () => {
    const config = await getConfig('ctrader');
    await testMarketOrder(
      async ({ orderToNew, position }) => {
        Logger.info('Created order', position);
        checkOrder(position, orderToNew, OrderStatus.live);

        const orderToUpdate = {
          ...position,
          config,
          stopLoss: 0.01,
          takeProfit: 10,
        };
        const orderUpdated = await updatePosition({
          order: position,
          options: orderToUpdate,
        });
        Logger.info('Updated order', orderUpdated);
        checkOrder(orderUpdated, orderToUpdate, OrderStatus.live);
      },
      config,
      'ctrader',
      ProviderType.icmarkets,
    );
  });

  test('metatrader limit', async () => {
    const config = await getConfig('meta');
    await testLimitOrder(
      async ({ orderToNew, order }) => {
        Logger.info('Created order', order);
        checkOrder(order, orderToNew, OrderStatus.pending);

        const orderToUpdate = {
          ...order,
          config,
          limitPrice: 0.6,
          stopLoss: 0.5,
          takeProfit: 0.7,
        };
        const orderUpdated = await updateOrder({
          order,
          options: orderToUpdate,
        });
        Logger.info('Updated order', orderUpdated);
        checkOrder(orderUpdated, orderToUpdate, OrderStatus.pending);
      },
      config,
      'meta',
      ProviderType.exness,
    );
  });

  test('metatrader market', async () => {
    const config = await getConfig('meta');
    await testMarketOrder(
      async ({ orderToNew, position }) => {
        Logger.info('Created order', position);
        checkOrder(position, orderToNew, OrderStatus.live);

        const orderToUpdate = {
          ...position,
          config,
          stopLoss: 0.01,
          takeProfit: 10,
        };
        const orderUpdated = await updatePosition({
          order: position,
          options: orderToUpdate,
        });
        Logger.info('Updated order', orderUpdated);
        checkOrder(orderUpdated, orderToUpdate, OrderStatus.live);
      },
      config,
      'meta',
      ProviderType.exness,
    );
  });
});
