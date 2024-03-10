import { RepositoryGetOptions, RepositoryUpdateOptions } from '..';

export interface BaseGetServiceParams<T> {
  options?: RepositoryGetOptions<T>,
}

export interface BaseUpdateServiceParams<T> {
  options?: RepositoryUpdateOptions<T>,
}
