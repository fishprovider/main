import fs from 'fs';
import protobuf, {
  ProtoBuilder, ReflectField, ReflectMessage, ReflectNamespace,
} from 'protobufjs';

import {
  CTraderDecodedMessage, CTraderMessageName, CTraderMessagePayloadType, CTraderProtobufMessages,
} from '../..';

const protoMessageName = 'ProtoMessage';

function buildMessage(message: ReflectMessage, builder: ProtoBuilder) {
  const { name, children } = message;

  const payloadTypeField = children.find((item) => item.name === 'payloadType');
  if (!payloadTypeField) {
    return { reason: `payloadType field not found: ${children.map((item) => item.name)}` };
  }
  const payloadType = (payloadTypeField as ReflectField).defaultValue;
  if (typeof payloadType !== 'number') {
    return { reason: `payloadType field is not number: ${typeof payloadType}` };
  }

  const messageBuilded = builder.build(name);
  return { name, payloadType, messageBuilded };
}

function loadProtoFile(file: string, builder?: ProtoBuilder) {
  if (!fs.existsSync(file)) {
    console.error(`${file} not exists`);
    return builder;
  }

  const newBuilder = protobuf.loadProtoFile(file, undefined, builder);
  return newBuilder;
}

export class ProtobufMessages implements CTraderProtobufMessages {
  names: Record<string, CTraderMessageName> = {};

  payloadTypes: Record<string, CTraderMessagePayloadType> = {};

  constructor(files: string[]) {
    const builder = files.reduce<ProtoBuilder | undefined>(
      (prevBuilder, file) => loadProtoFile(file, prevBuilder),
      undefined,
    );
    if (!builder) {
      console.error('Failed to load proto files', files);
      return;
    }
    builder.build();

    builder.ns.children.forEach((reflect) => {
      const { className } = reflect as ReflectNamespace;
      if (className === 'Message') {
        const {
          name, payloadType, messageBuilded,
          // reason,
        } = buildMessage(
          reflect as ReflectMessage,
          builder,
        );
        if (!name || !payloadType || !messageBuilded) {
          // console.warn('Unhandled message', reflect.name, reason);
          return;
        }
        this.names[name] = { name, payloadType, messageBuilded };
        this.payloadTypes[payloadType] = { payloadType, messageBuilded };
      } else if (className === 'Enum') {
        // console.log('Ignored className', className);
      } else {
        console.warn('Unhandled className', className, reflect.name);
      }
    });

    const messageBuilded = builder.build(protoMessageName);
    this.names[protoMessageName] = { name: protoMessageName, messageBuilded };
  }

  encode(name: string, payload: any, clientMsgId?: string): ByteBuffer {
    const payloadType = this.names[name]?.payloadType;
    if (!payloadType) {
      throw new Error(`[encode] Unknown name: ${name} - ${payloadType}`);
    }

    const Message = this.payloadTypes[payloadType]?.messageBuilded;
    if (!Message) {
      throw new Error(`[encode] Unknown payloadType: ${name} - ${payloadType}`);
    }
    const message = new Message(payload);

    const ProtoMessage = this.names[protoMessageName]?.messageBuilded;
    if (!ProtoMessage) {
      throw new Error(`[encode] Unknown protoMessageName: ${name} - ${protoMessageName}`);
    }
    const protoMessage = new ProtoMessage({
      payloadType,
      payload: message.toBuffer(),
      clientMsgId,
    });

    return protoMessage.encode();
  }

  decode(buffer: Buffer): CTraderDecodedMessage {
    const ProtoMessage = this.names[protoMessageName]?.messageBuilded;
    if (!ProtoMessage) {
      throw new Error(`[decode] Unknown protoMessageName: ${protoMessageName}`);
    }

    const protoMessage = ProtoMessage.decode(buffer);
    const { payload, payloadType, clientMsgId } = protoMessage;

    const Message = this.payloadTypes[payloadType]?.messageBuilded;
    if (!Message) {
      throw new Error(`[decode] Unknown payloadType: ${payloadType}`);
    }

    return {
      payload: Message.decode(payload),
      payloadType,
      clientMsgId,
    };
  }
}
