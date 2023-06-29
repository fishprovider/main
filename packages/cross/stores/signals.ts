import type { Signal } from '@fishbot/utils/types/Signal.model';

import { buildStoreSet } from '~libs/store';

const storeSignals = buildStoreSet<Signal>({}, 'signals');

export default storeSignals;
