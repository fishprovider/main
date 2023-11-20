import objectHash from 'object-hash';

export const buildKeyNews = (filter: any) => `fp-news:${objectHash(filter)}`;
