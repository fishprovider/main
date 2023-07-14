import type { Bar } from '@fishprovider/utils/dist/types/Bar.model';

import { buildStoreSet } from '~libs/store';

const storeBars = buildStoreSet<Bar>({}, 'bars');

export default storeBars;
