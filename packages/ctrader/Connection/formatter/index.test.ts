import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';

import ProtobufMessages from '../protobuf';
import Formatter from '.';

const rootPath = appRootPath.toString();

describe('Buffer should work as expected', () => {
  test('should have method: concat', () => {
    expect(Buffer.concat).toBeDefined();
  });

  test('should have method: slice', () => {
    expect(Buffer.prototype.slice).toBeDefined();
  });

  describe('(**) -> (*)(*) -> (**)', () => {
    let buffer: Buffer;
    const parts: Buffer[] = [];

    test('create buffer (**)', () => {
      buffer = Buffer.alloc(2);
      buffer.fill(7, 0, 1);
      buffer.fill(3, 1, 2);
      expect(buffer[0]).toBe(7);
      expect(buffer[1]).toBe(3);
    });

    test('slice buffer (**) into two buffers (*)(*)', () => {
      parts[0] = buffer.slice(0, 1);
      parts[1] = buffer.slice(1);
      expect(parts[0]).toBeTruthy();
      expect(parts[1]).toBeTruthy();
    });

    test('concat buffers (*)(*) into (*)', () => {
      const b = Buffer.concat(parts, (parts[0]?.length || 0) + (parts[1]?.length || 0));
      expect(b).toBeTruthy();
      expect(b[0]).toBe(buffer[0]);
      expect(b[1]).toBe(buffer[1]);
    });
  });
});

describe('EncodeDecode', () => {
  let protoMessages: ProtobufMessages;
  let checkBuffer: (buffer: Buffer) => void;
  let buffer: Buffer;
  let encodeDecode: Formatter;

  beforeAll(() => {
    protoMessages = new ProtobufMessages([
      path.join(rootPath, 'packages', 'ctrader', 'Connection', 'formatter', 'CommonMessages.test.proto'),
    ]);

    checkBuffer = (buff: Buffer) => {
      const msg = protoMessages.decode(buff);
      expect(msg.clientMsgId).toBeDefined();
    };
  });

  beforeEach(() => {
    buffer = fs.readFileSync(path.join(__dirname, 'test-file'));
    encodeDecode = new Formatter();
  });

  test('full buffer', () => {
    checkBuffer(buffer);
  });

  test('two messages in one buffer', (done) => {
    let count = 2;

    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      count -= 1;
      if (count === 0) {
        done();
      }
    };
    const buff = Buffer.concat([buffer, buffer], 2 * buffer.length);

    encodeDecode.decode(buff, decodeHandler);
  });

  test('two messages and half in one frame and rest into second frame', (done) => {
    let count = 3;

    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      count -= 1;
      if (count === 0) {
        done();
      }
    };

    const firstHalfBuffer = buffer.slice(0, 5);
    const lastHalfBuffer = buffer.slice(5);

    encodeDecode.decode(
      Buffer.concat([buffer, buffer, firstHalfBuffer], 2 * buffer.length + firstHalfBuffer.length),
      decodeHandler,
    );
    encodeDecode.decode(lastHalfBuffer, decodeHandler);
  });

  test('first part 1 byte', (done) => {
    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      done();
    };

    encodeDecode.decode(buffer.slice(0, 1), decodeHandler);
    encodeDecode.decode(buffer.slice(1), decodeHandler);
  });

  test('first part 1 byte, second part 4 byte', (done) => {
    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      done();
    };

    encodeDecode.decode(buffer.slice(0, 1), decodeHandler);
    encodeDecode.decode(buffer.slice(1, 5), decodeHandler);
    encodeDecode.decode(buffer.slice(5), decodeHandler);
  });

  test('cut to array of 1 byte', (done) => {
    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      done();
    };

    for (let i = 1; i <= buffer.length; i += 1) {
      encodeDecode.decode(buffer.slice(i - 1, i), decodeHandler);
    }
  });

  test('first part 6 byte, second part 1 byte', (done) => {
    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      done();
    };

    encodeDecode.decode(buffer.slice(0, 6), decodeHandler);
    encodeDecode.decode(buffer.slice(6, 7), decodeHandler);
    encodeDecode.decode(buffer.slice(7), decodeHandler);
  });

  test('last part 1 byte', (done) => {
    const decodeHandler = (buff: Buffer) => {
      checkBuffer(buff);
      done();
    };

    const separator = buffer.length - 1;

    encodeDecode.decode(buffer.slice(0, separator), decodeHandler);
    encodeDecode.decode(buffer.slice(separator), decodeHandler);
  });
});
