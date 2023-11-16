import _ from 'lodash';
import hash from 'object-hash';

export const buildKeyNews = (filter: any) => `fp-news:${hash(_.compact(filter))}`;
