import { push } from '@fishbot/core/libs/firebase';
import { EntryType } from '@fishbot/metatrader/constants/metaApi';
import type { CallbackPayload } from '@fishbot/metatrader/types/Event.model';
import { transformDeal } from '@fishbot/swap/libs/metatrader/transform';
import { newRequestOrder } from '@fishbot/swap/utils/command';
import { OrderStatus } from '@fishbot/utils/constants/order';
import type { RedisSymbol } from '@fishbot/utils/types/Redis.model';
import moment from 'moment';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

/*
{
  type: 'deal',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  deal: {
    id: '267645634',
    platform: 'mt4',
    type: 'DEAL_TYPE_BUY',
    time: 2023-04-22T00:34:06.000Z,
    brokerTime: '2023-04-22 00:34:06.000',
    commission: 0,
    swap: 0,
    profit: 0,
    symbol: 'BTCUSD',
    magic: 0,
    orderId: '267645634',
    positionId: '267645634',
    reason: 'DEAL_REASON_UNKNOWN',
    entryType: 'DEAL_ENTRY_IN',
    volume: 0.01,
    price: 27255,
    accountCurrencyExchangeRate: 1,
    updateSequenceNumber: 1682123646000012
  },
  providerId: 'meta',
  symbolIds: {
    AUDUSD: {
      symbol: 'AUDUSD',
      symbolId: 'AUDUSD',
      baseAsset: 'AUD',
      quoteAsset: 'USD',
      lotSize: 100000,
      pipSize: 0.0001,
      digits: 5,
      minVolume: 1000,
      maxVolume: 20000000
    },
    BTCUSD: {
      symbol: 'BTCUSD',
      symbolId: 'BTCUSD',
      baseAsset: 'BTC',
      quoteAsset: 'USD',
      lotSize: 1,
      pipSize: 0.01,
      digits: 2,
      minVolume: 0.01,
      maxVolume: 20
    },
    ...
  }
}

{
  deal: {
    id: '266582522',
    platform: 'mt4',
    type: 'DEAL_TYPE_BUY',
    time: 2023-04-20T02:55:57.000Z,
    brokerTime: '2023-04-20 02:55:57.000',
    commission: 0,
    swap: 0,
    profit: 2.79,
    symbol: 'NZDUSD',
    magic: 0,
    orderId: '266582522',
    positionId: '266582421',
    reason: 'DEAL_REASON_UNKNOWN',
    brokerComment: 'from #266582421',
    entryType: 'DEAL_ENTRY_OUT',
    volume: 0.03,
    price: 0.61605,
    accountCurrencyExchangeRate: 1,
    updateSequenceNumber: 1681986949000050
  },
  ...
}
*/

const handleOrderDeal = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { deal } = payload;

  if (deal.time && moment().diff(moment(deal.time), 'hours') > 24) {
    Logger.debug('[handleOrderDeal] Skipped old deal', deal.time);
    return 4;
  }

  const { _id: providerId } = account;
  Logger.debug('[handleOrderDeal] payload', providerId, payload);

  const { providerType } = account;

  if (![
    EntryType.DEAL_ENTRY_IN,
    EntryType.DEAL_ENTRY_OUT,
  ].includes(deal.entryType)) {
    Logger.debug('[handleOrderDeal] Unhandled entryType', deal.entryType);
    return 3;
  }

  const {
    requestOrder, orderId, positionId, comment,
  } = await checkRequestOrder(providerId, deal);

  const isClosed = deal.entryType === EntryType.DEAL_ENTRY_OUT;
  const orderToUpdate = {
    ...transformDeal(
      deal,
      providerId,
      providerType,
      symbolIds,
    ),
    status: isClosed ? OrderStatus.closed : OrderStatus.live,
  };

  if (requestOrder) {
    Logger.debug('[handleOrderDeal] requestOrder found', orderId, positionId);
    await updateRequestOrder(
      requestOrder,
      {
        ...orderToUpdate,

        _id: requestOrder._id,
        orderId,
        positionId,
        comment,

        sourceType: 'event',
        tag: 'filled-update',
      },
      payload,
    );

    push(
      {
        title: `[${providerId}] ${isClosed ? 'Closed' : 'Filled'} order`,
        body: `[${positionId}] ${orderToUpdate.direction} ${orderToUpdate.volume} ${orderToUpdate.symbol}`,
      },
      providerId,
    );

    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderDeal] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderDeal] new requestOrder', providerId);
  await newRequestOrder(
    {
      ...orderToUpdate,

      orderId,
      positionId,
      comment,

      sourceType: 'event',
      tag: 'filled-create',
    },
    payload,
  );

  push(
    {
      title: `[${providerId}] ${isClosed ? 'Closed' : 'Filled'} order`,
      body: `[${positionId}] ${orderToUpdate.direction} ${orderToUpdate.volume} ${orderToUpdate.symbol}`,
    },
    providerId,
  );

  return -1;
};

export default handleOrderDeal;
