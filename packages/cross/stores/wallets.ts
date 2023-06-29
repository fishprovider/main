import type { Wallet } from '@fishbot/utils/types/Pay.model';

import { buildStoreSet } from '~libs/store';

const storeWallets = buildStoreSet<Wallet>({}, 'wallets');

export default storeWallets;
