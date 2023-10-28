/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */

import type {
  MetatraderAccountInformation, MetatraderDeal, MetatraderOrder, MetatraderPosition,
  MetatraderSymbolPrice, SynchronizationListener,
} from 'metaapi.cloud-sdk';

import { MetaApiCallbackPayload, MetaApiCallbackType } from '..';

export class MetaApiListener implements SynchronizationListener {
  accountId: string;

  onEvent: (_: MetaApiCallbackPayload) => void;

  constructor(
    accountId: string,
    onEvent: (_: MetaApiCallbackPayload) => void,
  ) {
    this.accountId = accountId;
    this.onEvent = onEvent;
  }

  /**
   * Invoked when connection to MetaTrader terminal terminated
   * @param {String} instanceIndex index of an account instance connected
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onDisconnected(instanceIndex: string): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.appDisconnect,
      instanceIndex,
      accountId: this.accountId,
    });
  }

  /**
   * Invoked when MetaTrader account information is updated
   * @param {String} instanceIndex index of an account instance connected
   * @param {MetatraderAccountInformation} accountInformation updated MetaTrader account information
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onAccountInformationUpdated(
    instanceIndex: string,
    accountInformation: MetatraderAccountInformation,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.account,
      instanceIndex,
      accountId: this.accountId,
      accountInformation,
    });
  }

  /**
   * Invoked when MetaTrader position is updated
   * @param {String} instanceIndex index of an account instance connected
   * @param {MetatraderPosition} position updated MetaTrader position
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onPositionUpdated(
    instanceIndex: string,
    position: MetatraderPosition,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.position,
      instanceIndex,
      accountId: this.accountId,
      position,
    });
  }

  /**
   * Invoked when MetaTrader position is removed
   * @param {String} instanceIndex index of an account instance connected
   * @param {String} positionId removed MetaTrader position id
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onPositionRemoved(
    instanceIndex: string,
    positionId: string,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.removePosition,
      instanceIndex,
      accountId: this.accountId,
      positionId,
    });
  }

  /**
   * Invoked when MetaTrader pending order is updated
   * @param {String} instanceIndex index of an account instance connected
   * @param {MetatraderOrder} order updated MetaTrader pending order
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onPendingOrderUpdated(
    instanceIndex: string,
    order: MetatraderOrder,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.order,
      instanceIndex,
      accountId: this.accountId,
      order,
    });
  }

  /**
   * Invoked when MetaTrader pending order is completed (executed or canceled)
   * @param {String} instanceIndex index of an account instance connected
   * @param {String} orderId completed MetaTrader pending order id
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onPendingOrderCompleted(
    instanceIndex: string,
    orderId: string,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.completeOrder,
      instanceIndex,
      accountId: this.accountId,
      orderId,
    });
  }

  /**
   * Invoked when a new MetaTrader history order is added
   * @param {String} instanceIndex index of an account instance connected
   * @param {MetatraderOrder} historyOrder new MetaTrader history order
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onHistoryOrderAdded(
    instanceIndex: string,
    order: MetatraderOrder,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.history,
      instanceIndex,
      accountId: this.accountId,
      order,
    });
  }

  /**
   * Invoked when a new MetaTrader history deal is added
   * @param {String} instanceIndex index of an account instance connected
   * @param {MetatraderDeal} deal new MetaTrader history deal
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onDealAdded(
    instanceIndex: string,
    deal: MetatraderDeal,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.deal,
      instanceIndex,
      accountId: this.accountId,
      deal,
    });
  }

  /**
   * Invoked when a symbol price was updated
   * @param {String} instanceIndex index of an account instance connected
   * @param {MetatraderSymbolPrice} price updated MetaTrader symbol price
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  async onSymbolPriceUpdated(
    instanceIndex: string,
    price: MetatraderSymbolPrice,
  ): Promise<any> {
    this.onEvent({
      type: MetaApiCallbackType.price,
      instanceIndex,
      accountId: this.accountId,
      price,
    });
  }

  // async onTicksUpdated(
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

  // async onCandlesUpdated(
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

  /**
   * Returns region of instance index
   * @param {String} instanceIndex instance index
   */ getRegion(instanceIndex: string) {
    return typeof instanceIndex === 'string' ? instanceIndex.split(':')[0] : undefined;
  }
  /**
 * Returns instance number of instance index
 * @param {String} instanceIndex instance index
 */ getInstanceNumber(instanceIndex: string) {
    return typeof instanceIndex === 'string' ? Number(instanceIndex.split(':')[1]) : undefined;
  }
  /**
 * Returns host name of instance index
 * @param {String} instanceIndex instance index
 */ getHostName(instanceIndex: string) {
    return typeof instanceIndex === 'string' ? instanceIndex.split(':')[2] : undefined;
  }
  /**
 * Invoked when connection to MetaTrader terminal established
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Number} _replicas number of account replicas launched
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onConnected(_instanceIndex: any, _replicas: any) {}
  /**
 * Server-side application health status
 * @typedef {Object} healthStatus
 * @property {boolean} [restApiHealthy] flag indicating that REST API is healthy
 * @property {boolean} [copyFactorySubscriberHealthy] flag indicating that CopyFactory subscriber is healthy
 * @property {boolean} [copyFactoryProviderHealthy] flag indicating that CopyFactory provider is healthy
 */ /**
 * Invoked when a server-side application health status is received from MetaApi
 * @param {String} _instanceIndex index of an account instance connected
 * @param {HealthStatus} _status server-side application health status
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onHealthStatus(_instanceIndex: any, _status: any) {}

  /**
 * Invoked when broker connection satus have changed
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Boolean} _connected is MetaTrader terminal is connected to broker
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onBrokerConnectionStatusChanged(_instanceIndex: any, _connected: any) {}
  /**
 * Invoked when MetaTrader terminal state synchronization is started
 * @param {string} _instanceIndex index of an account instance connected
 * @param {string} _specificationsHash specifications hash
 * @param {string} _positionsHash positions hash
 * @param {string} _ordersHash orders hash
 * @param {string} _synchronizationId synchronization id
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onSynchronizationStarted(_instanceIndex: any, _specificationsHash: any, _positionsHash: any, _ordersHash: any, _synchronizationId: any) {}

  /**
 * Invoked when the positions are replaced as a result of initial terminal state synchronization. This method
 * will be invoked only if server thinks the data was updated, otherwise invocation can be skipped
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Array<MetatraderPosition>} _positions updated array of positions
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onPositionsReplaced(_instanceIndex: any, _positions: any) {}
  /**
 * Invoked when position synchronization fnished to indicate progress of an initial terminal state synchronization
 * @param {string} _instanceIndex index of an account instance connected
 * @param {String} _synchronizationId synchronization request id
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onPositionsSynchronized(_instanceIndex: any, _synchronizationId: any) {}
  /**
 * Invoked when MetaTrader positions are updated
 * @param {string} _instanceIndex index of an account instance connected
 * @param {MetatraderPosition[]} _positions updated MetaTrader positions
 * @param {string[]} _removedPositionIds removed position ids
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onPositionsUpdated(_instanceIndex: any, _positions: any, _removedPositionIds: any) {}

  /**
 * Invoked when the pending orders are replaced as a result of initial terminal state synchronization. This method
 * will be invoked only if server thinks the data was updated, otherwise invocation can be skipped
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Array<MetatraderOrder>} _orders updated array of pending orders
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onPendingOrdersReplaced(_instanceIndex: any, _orders: any) {}
  /**
 * Invoked when MetaTrader pending orders are updated or completed
 * @param {string} _instanceIndex index of an account instance connected
 * @param {MetatraderOrder[]} _orders updated MetaTrader pending orders
 * @param {string[]} _completedOrderIds completed MetaTrader pending order ids
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onPendingOrdersUpdated(_instanceIndex: any, _orders: any, _completedOrderIds: any) {}
  /**
 * Invoked when pending order synchronization fnished to indicate progress of an initial terminal state
 * synchronization
 * @param {string} _instanceIndex index of an account instance connected
 * @param {String} _synchronizationId synchronization request id
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onPendingOrdersSynchronized(_instanceIndex: any, _synchronizationId: any) {}
  /**
 * Invoked when a synchronization of history orders on a MetaTrader account have finished to indicate progress of an
 * initial terminal state synchronization
 * @param {String} _instanceIndex index of an account instance connected
 * @param {String} _synchronizationId synchronization request id
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onHistoryOrdersSynchronized(_instanceIndex: any, _synchronizationId: any) {}
  /**
 * Invoked when a synchronization of history deals on a MetaTrader account have finished to indicate progress of an
 * initial terminal state synchronization
 * @param {String} _instanceIndex index of an account instance connected
 * @param {String} _synchronizationId synchronization request id
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onDealsSynchronized(_instanceIndex: any, _synchronizationId: any) {}
  /**
 * Invoked when a symbol specification was updated
 * @param {String} _instanceIndex index of an account instance connected
 * @param {MetatraderSymbolSpecification} _specification updated MetaTrader symbol specification
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onSymbolSpecificationUpdated(_instanceIndex: any, _specification: any) {}
  /**
 * Invoked when a symbol specification was removed
 * @param {String} _instanceIndex index of an account instance connected
 * @param {String} _symbol removed symbol
 * @returns {Promise} promise which resolves when the asynchronous event is processed
 */ async onSymbolSpecificationRemoved(_instanceIndex: any, _symbol: any) {}
  /**
 * Invoked when a symbol specifications were updated
 * @param {String} _instanceIndex index of account instance connected
 * @param {Array<MetatraderSymbolSpecification>} _specifications updated specifications
 * @param {Array<String>} _removedSymbols removed symbols
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onSymbolSpecificationsUpdated(_instanceIndex: any, _specifications: any, _removedSymbols: any) {}
  /**
 * Invoked when prices for several symbols were updated
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Array<MetatraderSymbolPrice>} _prices updated MetaTrader symbol prices
 * @param {Number} _equity account liquidation value
 * @param {Number} _margin margin used
 * @param {Number} _freeMargin free margin
 * @param {Number} _marginLevel margin level calculated as % of equity/margin
 * @param {Number} _accountCurrencyExchangeRate current exchange rate of account currency into USD
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onSymbolPricesUpdated(_instanceIndex: any, _prices: any, _equity: any, _margin: any, _freeMargin: any, _marginLevel: any, _accountCurrencyExchangeRate: any) {}
  /**
 * Invoked when symbol candles were updated
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Array<MetatraderCandle>} _candles updated MetaTrader symbol candles
 * @param {Number} _equity account liquidation value
 * @param {Number} _margin margin used
 * @param {Number} _freeMargin free margin
 * @param {Number} _marginLevel margin level calculated as % of equity/margin
 * @param {Number} _accountCurrencyExchangeRate current exchange rate of account currency into USD
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onCandlesUpdated(_instanceIndex: any, _candles: any, _equity: any, _margin: any, _freeMargin: any, _marginLevel: any, _accountCurrencyExchangeRate: any) {}
  /**
 * Invoked when symbol ticks were updated
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Array<MetatraderTick>} _ticks updated MetaTrader symbol ticks
 * @param {Number} _equity account liquidation value
 * @param {Number} _margin margin used
 * @param {Number} _freeMargin free margin
 * @param {Number} _marginLevel margin level calculated as % of equity/margin
 * @param {Number} _accountCurrencyExchangeRate current exchange rate of account currency into USD
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onTicksUpdated(_instanceIndex: any, _ticks: any, _equity: any, _margin: any, _freeMargin: any, _marginLevel: any, _accountCurrencyExchangeRate: any) {}
  /**
 * Invoked when order books were updated
 * @param {String} _instanceIndex index of an account instance connected
 * @param {Array<MetatraderBook>} _books updated MetaTrader order books
 * @param {Number} _equity account liquidation value
 * @param {Number} _margin margin used
 * @param {Number} _freeMargin free margin
 * @param {Number} _marginLevel margin level calculated as % of equity/margin
 * @param {Number} _accountCurrencyExchangeRate current exchange rate of account currency into USD
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onBooksUpdated(_instanceIndex: any, _books: any, _equity: any, _margin: any, _freeMargin: any, _marginLevel: any, _accountCurrencyExchangeRate: any) {}
  /**
 * Invoked when subscription downgrade has occurred
 * @param {String} _instanceIndex index of an account instance connected
 * @param {string} _symbol symbol to update subscriptions for
 * @param {Array<MarketDataSubscription>} _updates array of market data subscription to update
 * @param {Array<MarketDataUnsubscription>} _unsubscriptions array of subscriptions to cancel
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onSubscriptionDowngraded(_instanceIndex: any, _symbol: any, _updates: any, _unsubscriptions: any) {}
  /**
 * Invoked when a stream for an instance index is closed
 * @param {String} _instanceIndex index of an account instance connected
 */ async onStreamClosed(_instanceIndex: any) {}
  /**
 * Invoked when account region has been unsubscribed
 * @param {String} _region account region unsubscribed
 * @return {Promise} promise which resolves when the asynchronous event is processed
 */ async onUnsubscribeRegion(_region: any) {}
}
