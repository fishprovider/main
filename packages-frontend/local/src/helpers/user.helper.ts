import _ from 'lodash';
import hash from 'object-hash';

export const buildKeyUser = (filter: any) => `fp-user:${hash(_.compact(filter))}`;
