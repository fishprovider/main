import type { Price } from '@fishbot/utils/types/Price.model';

import { buildStoreSet } from '~libs/store';

const storePrices = buildStoreSet<Price>({}, 'prices');

export default storePrices;
