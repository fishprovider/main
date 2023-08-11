export type Projection<T> = Partial<Record<keyof T, 0 | 1>>;

export enum RepositoryError {
  'NOT_IMPLEMENTED' = 'NOT_IMPLEMENTED',
}
