import type {
  Account, Activity, BannerStatus, ProtectSettings,
  Settings, TradeSettings,
} from '@fishprovider/utils/dist/types/Account.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeAccounts from '~stores/accounts';

const accountUpdate = async (
  payload: {
    providerId: string;
    accountViewType?: string,
    name?: string,
    icon?: string,
    strategyId?: string,
    tradeSettings?: TradeSettings;
    protectSettings?: ProtectSettings,
    settings?: Settings;
    notes?: string;
    privateNotes?: string;
    bannerStatus?: BannerStatus;
    activity?: Activity,
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Account>('/accounts/update', payload, options);
  storeAccounts.mergeDoc(doc);
  return doc;
};

export default accountUpdate;
