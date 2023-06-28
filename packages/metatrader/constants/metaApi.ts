//
// order
//

enum ActionType {
  ORDER_TYPE_BUY = 'ORDER_TYPE_BUY',
  ORDER_TYPE_SELL = 'ORDER_TYPE_SELL',
  ORDER_TYPE_BUY_LIMIT = 'ORDER_TYPE_BUY_LIMIT',
  ORDER_TYPE_SELL_LIMIT = 'ORDER_TYPE_SELL_LIMIT',
  ORDER_TYPE_BUY_STOP = 'ORDER_TYPE_BUY_STOP',
  ORDER_TYPE_SELL_STOP = 'ORDER_TYPE_SELL_STOP',
  POSITION_TYPE_BUY = 'POSITION_TYPE_BUY',
  POSITION_TYPE_SELL = 'POSITION_TYPE_SELL',
  DEAL_TYPE_BUY = 'DEAL_TYPE_BUY',
  DEAL_TYPE_SELL = 'DEAL_TYPE_SELL',
}

enum OrderState {
  ORDER_STATE_FILLED = 'ORDER_STATE_FILLED',
}

enum EntryType {
  DEAL_ENTRY_IN = 'DEAL_ENTRY_IN',
  DEAL_ENTRY_OUT = 'DEAL_ENTRY_OUT',
}

//
// event callback
//

enum CallbackType {
  'appDisconnect' = 'appDisconnect',

  'account' = 'account',

  'order' = 'order',
  'completeOrder' = 'completeOrder',

  'position' = 'position',
  'removePosition' = 'removePosition',

  'history' = 'history',
  'deal' = 'deal',

  'price' = 'price',
}

export {
  ActionType,
  CallbackType,
  EntryType,
  OrderState,
};
