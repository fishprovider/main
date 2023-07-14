import type { Signal } from '@fishprovider/utils/dist/types/Signal.model';

import { buildStoreSet } from '~libs/store';

const storeSignals = buildStoreSet<Signal>({}, 'signals');

export default storeSignals;
