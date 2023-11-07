import hash from 'object-hash';

export const buildKeyUser = (filter: {
  email?: string,
}) => `fp-user:${hash(filter)}`;
