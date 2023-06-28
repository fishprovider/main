enum ErrorType {
  badRequest = 'Bad Request',
  userNotFound = 'User Not Found',
  accessDenied = 'Access Denied',
  tokenExpired = 'Token Expired',

  accountNotFound = 'Account Not Found',
  walletNotFound = 'Wallet Not Found',
  transactionNotFound = 'Transaction Not Found',
  priceNotFound = 'Price Not Found',
  threadNotFound = 'Thread Not Found',

  unknown = 'Error. Please Try Later',
}

export { ErrorType };
