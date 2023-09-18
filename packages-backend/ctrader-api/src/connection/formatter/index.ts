import { CTraderFormatter } from '../..';

export class Formatter implements CTraderFormatter {
  sizeLength = 4;

  size: number | undefined;

  tail: Buffer | undefined;

  encode(data: ByteBuffer): Buffer {
    const buff = data.toBuffer();
    const dataLength = buff.length;
    const size = Buffer.alloc(this.sizeLength);
    size.writeInt32BE(dataLength, 0);
    return Buffer.concat([size, buff], this.sizeLength + dataLength);
  }

  decode(buff: Buffer, decodeHandler: (data: Buffer) => void): void {
    let buffer = buff;
    if (this.tail) {
      buffer = Buffer.concat([this.tail, buff], this.tail.length + buff.length);
      this.tail = undefined;
    }

    if (this.size) {
      if (buffer.length >= this.size) {
        decodeHandler(buffer.slice(0, this.size));
        const prevSize = this.size;
        this.size = undefined;
        if (buffer.length !== prevSize) {
          this.decode(buffer.slice(prevSize), decodeHandler);
        }
        return;
      }
    } else if (buffer.length >= this.sizeLength) {
      this.size = buffer.readUInt32BE(0);
      if (buffer.length !== this.sizeLength) {
        this.decode(buffer.slice(this.sizeLength), decodeHandler);
      }
      return;
    }
    this.tail = buffer;
  }
}
