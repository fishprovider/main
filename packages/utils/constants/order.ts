enum Direction {
  buy = 'buy',
  sell = 'sell',
}

enum OrderType {
  market = 'market',
  limit = 'limit',
  stop = 'stop',
}

enum OrderStatus {
  idea = 'idea',
  pending = 'pending',
  live = 'live',
  closed = 'closed',
}

export {
  Direction,
  OrderStatus,
  OrderType,
};
