// @ts-ignore crypto-random-string is ok
import cryptoRandomString from 'crypto-random-string';
const random = (length = 10) => cryptoRandomString({ length });
export default random;
