interface Formatter {
  sizeLength: number;
  size: number | undefined;
  tail: Buffer | undefined;

  encode(data: ByteBuffer): Buffer;
  decode(buff: Buffer, decodeHandler: (data: Buffer) => void): void;
}

export type {
  Formatter,
};
