import cryptoRandomString from 'crypto-random-string';

const randomId = (length = 10) => cryptoRandomString({ length });

export default randomId;
