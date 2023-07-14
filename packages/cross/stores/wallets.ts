import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';

import { buildStoreSet } from '~libs/store';

const storeWallets = buildStoreSet<Wallet>({}, 'wallets');

export default storeWallets;
