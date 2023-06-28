import {
  MetatraderAccountInformation,
  MetatraderDeal, MetatraderOrder, MetatraderPosition,
  MetatraderSymbolPrice, SynchronizationListener,
} from 'metaapi.cloud-sdk';

import { CallbackType } from '~constants/metaApi';
import type { CallbackPayload } from '~types/Event.model';

class Listener extends SynchronizationListener {
  accountId: string;

  onEvent: (_: CallbackPayload) => void;

  constructor(
    accountId: string,
    onEvent: (_: CallbackPayload) => void,
  ) {
    super();
    this.accountId = accountId;
    this.onEvent = onEvent;
  }

  override async onDisconnected(instanceIndex: string): Promise<any> {
    this.onEvent({
      type: CallbackType.appDisconnect,
      instanceIndex,
      accountId: this.accountId,
    });
  }

  override async onAccountInformationUpdated(
    instanceIndex: string,
    accountInformation: MetatraderAccountInformation,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.account,
      instanceIndex,
      accountId: this.accountId,
      accountInformation,
    });
  }

  override async onPositionUpdated(
    instanceIndex: string,
    position: MetatraderPosition,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.position,
      instanceIndex,
      accountId: this.accountId,
      position,
    });
  }

  override async onPositionRemoved(
    instanceIndex: string,
    positionId: string,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.removePosition,
      instanceIndex,
      accountId: this.accountId,
      positionId,
    });
  }

  override async onPendingOrderUpdated(
    instanceIndex: string,
    order: MetatraderOrder,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.order,
      instanceIndex,
      accountId: this.accountId,
      order,
    });
  }

  override async onPendingOrderCompleted(
    instanceIndex: string,
    orderId: string,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.completeOrder,
      instanceIndex,
      accountId: this.accountId,
      orderId,
    });
  }

  override async onHistoryOrderAdded(
    instanceIndex: string,
    order: MetatraderOrder,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.history,
      instanceIndex,
      accountId: this.accountId,
      order,
    });
  }

  override async onDealAdded(
    instanceIndex: string,
    deal: MetatraderDeal,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.deal,
      instanceIndex,
      accountId: this.accountId,
      deal,
    });
  }

  override async onSymbolPriceUpdated(
    instanceIndex: string,
    price: MetatraderSymbolPrice,
  ): Promise<any> {
    this.onEvent({
      type: CallbackType.price,
      instanceIndex,
      accountId: this.accountId,
      price,
    });
  }

  // override async onTicksUpdated(
  //   _1: string,
  //   ticks: MetatraderTick[],
  //   equity: number,
  //   margin: number,
  //   freeMargin: number,
  //   marginLevel: number,
  //   accountCurrencyExchangeRate: number,
  // ): Promise<any> {
  //   this.onEvent({
  //     type: 'onTicksUpdated',
  //     accountId: this.accountId,
  //     ticks,
  //     equity,
  //     margin,
  //     freeMargin,
  //     marginLevel,
  //     accountCurrencyExchangeRate,
  //   });
  // }

  // override async onCandlesUpdated(
  //   _1: string,
  //   candles: MetatraderCandle[],
  //   equity: number,
  //   margin: number,
  //   freeMargin: number,
  //   marginLevel: number,
  //   accountCurrencyExchangeRate: number,
  // ): Promise<any> {
  //   this.onEvent({
  //     type: 'onCandlesUpdated',
  //     accountId: this.accountId,
  //     candles,
  //     equity,
  //     margin,
  //     freeMargin,
  //     marginLevel,
  //     accountCurrencyExchangeRate,
  //   });
  // }
}

export default Listener;
