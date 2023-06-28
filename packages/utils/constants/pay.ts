enum TransactionType {
  deposit = 'deposit',
  withdraw = 'withdraw',
  transfer = 'transfer',
}

enum TransactionStatus {
  new = 'new',
  cancelled = 'cancelled',
  expired = 'expired',
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

enum TransactionStatusRequest {
  unknownError = 'unknownError',
  toSuccess = 'toSuccess',
  sendExternal = 'sendExternal',
}

enum SourceType {
  wallet = 'wallet', // withdraw/transfer - walletId
  reward = 'reward', // deposit
  fishPay = 'fishPay', // deposit - payId
  requestFinance = 'requestFinance', // deposit - invoiceId
  coinbaseCommerce = 'coinbaseCommerce', // deposit - chargeId
}

enum DestinationType {
  wallet = 'wallet', // deposit/transfer - walletId
  external = 'external', // withdraw - address
}

enum DestinationPayType {
  manual = 'manual',
  coinbaseApi = 'coinbaseApi',
  web3 = 'web3',
}

enum WalletType {
  spot = 'spot',
  invest = 'invest',
  external = 'external',
}

enum InvestStatus {
  new = 'new',
  pending = 'pending',
  stopping = 'stopping',
  active = 'active',
  inactive = 'inactive',
}

export {
  DestinationPayType,
  DestinationType,
  InvestStatus,
  SourceType,
  TransactionStatus,
  TransactionStatusRequest,
  TransactionType,
  WalletType,
};
