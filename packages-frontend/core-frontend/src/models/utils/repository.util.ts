// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BaseGetOptions<T> {
}

export interface BaseUpdateOptions<T> extends BaseGetOptions<T> {
}

export interface BaseGetResult<T> {
  doc?: Partial<T>;
}

export interface BaseUpdateResult<T> extends BaseGetResult<T> {
}

export interface BaseGetManyResult<T> {
  docs?: Partial<T>[];
}
