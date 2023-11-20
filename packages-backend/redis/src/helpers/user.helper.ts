import objectHash from 'object-hash';

export const buildKeyUser = (filter: any) => `fp-user:${objectHash(filter)}`;
