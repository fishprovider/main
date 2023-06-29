import type { Bar } from '@fishbot/utils/types/Bar.model';

import { buildStoreSet } from '~libs/store';

const storeBars = buildStoreSet<Bar>({}, 'bars');

export default storeBars;
