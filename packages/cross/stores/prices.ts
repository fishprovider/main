import type { Price } from '@fishprovider/utils/types/Price.model';

import { buildStoreSet } from '~libs/store';

const storePrices = buildStoreSet<Price>({}, 'prices');

export default storePrices;
