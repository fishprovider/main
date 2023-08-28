export class BaseError extends Error {
  code: string;

  constructor(
    code: string,
    message?: string,
    cause?: Error,
  ) {
    super(message, { cause });

    this.code = code;
  }
}
