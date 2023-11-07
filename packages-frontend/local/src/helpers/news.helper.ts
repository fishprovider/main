import hash from 'object-hash';

export const buildKeyNews = (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => `fp-news:${hash(filter)}`;
