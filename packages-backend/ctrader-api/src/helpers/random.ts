import cryptoRandomString from 'crypto-random-string';

export const random = (length = 10) => cryptoRandomString({ length });
