export type Projection<T> = Partial<Record<keyof T, 0 | 1>>;

export enum RepositoryError {
  'BAD_RESULT' = 'BAD_RESULT',
  'NOT_IMPLEMENTED' = 'NOT_IMPLEMENTED',
}
