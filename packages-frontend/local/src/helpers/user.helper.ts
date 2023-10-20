export const buildKeyUser = (filter: {
  email?: string,
}) => `fp-user-${filter.email || 'current'}`;
