import type { Signal } from '@fishprovider/utils/dist/types/Signal.model';
import _ from 'lodash';

import { ApiConfig, apiGet } from '~libs/api';
import storeSignals from '~stores/signals';

const signalGetMany = async (
  payload: {
    symbol: string;
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<Signal[]>('/signals/getMany', payload, options);
  storeSignals.mergeDocs(docs);
  return docs;
};

export default signalGetMany;
