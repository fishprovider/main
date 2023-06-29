import { SourceType } from '@fishbot/utils/constants/pay';

const SourceTypeText: Record<string, string> = {
  [SourceType.coinbaseCommerce]: 'Coinbase Commerce',
  [SourceType.requestFinance]: 'Request Finance',
  [SourceType.fishPay]: 'FishPay (FishPlatform)',
};

export {
  SourceTypeText,
};
