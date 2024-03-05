import objectHash from 'object-hash';

export const buildKeyAccount = (filter: any) => `v2-fp-account:${objectHash(filter)}`;

export const buildKeyAccounts = (filter: any) => `v2-fp-accounts:${objectHash(filter)}`;
