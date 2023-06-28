enum ChargePricingType {
  fixed_price = 'fixed_price',
  no_price = 'no_price',
}

enum ChargeStatus {
  NEW = 'NEW',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',

  RESOLVED = 'RESOLVED',
  UNRESOLVED = 'UNRESOLVED',

  REFUNDING = 'REFUNDING', // or Pending Refund?
  REFUNDED = 'REFUNDED',
}

export {
  ChargePricingType,
  ChargeStatus,
};
