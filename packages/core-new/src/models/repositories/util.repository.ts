export type Projection<T> = Partial<Record<keyof T, 0 | 1>>;

export interface BaseGetParams<T> {
  projection?: Projection<T>
}

export interface BaseUpdateParams {
  returnDoc?: boolean
}
