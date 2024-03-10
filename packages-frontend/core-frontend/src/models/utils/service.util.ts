import { RepositoryGetOptions, RepositoryUpdateOptions } from '..';

export interface ServiceGetParams<T> {
  options?: RepositoryGetOptions<T>,
}

export interface ServiceUpdateParams<T> {
  options?: RepositoryUpdateOptions<T>,
}
