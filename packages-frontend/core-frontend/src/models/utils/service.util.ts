import { BaseGetOptions, BaseUpdateOptions } from '..';

export interface BaseGetServiceParams<T> {
  options?: BaseGetOptions<T>,
}

export interface BaseUpdateServiceParams<T> {
  options?: BaseUpdateOptions<T>,
}
