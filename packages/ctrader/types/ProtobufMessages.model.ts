import type { Message, MetaMessage } from 'protobufjs';

import type { PayloadType } from '~constants/openApi';

interface MessageName {
  name: string;
  payloadType?: PayloadType;
  messageBuilded: MetaMessage<Message>;
}

interface MessagePayloadType {
  payloadType: PayloadType;
  messageBuilded: MetaMessage<Message>;
}

interface DecodedMessage {
  payload: any;
  payloadType: PayloadType;
  clientMsgId?: string;
}

interface ProtobufMessages {
  names: Record<string, MessageName>;
  payloadTypes: Record<string, MessagePayloadType>;

  encode: (name: string, payload: any, clientMsgId?: string) => ByteBuffer;
  decode: (buffer: Buffer) => DecodedMessage;
}

export type {
  DecodedMessage,
  MessageName,
  MessagePayloadType,
  ProtobufMessages,
};
