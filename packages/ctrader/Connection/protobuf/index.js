/* eslint-disable func-names, array-callback-return */
import fs from 'fs';
import protobuf from 'protobufjs';
const protoMessageName = 'ProtoMessage';
function buildMessage(message, builder) {
    const { name, children } = message;
    const payloadTypeField = children.find((item) => item.name === 'payloadType');
    if (!payloadTypeField) {
        return { reason: `payloadType field not found: ${children.map((item) => item.name)}` };
    }
    const payloadType = payloadTypeField.defaultValue;
    if (typeof payloadType !== 'number') {
        return { reason: `payloadType field is not number: ${typeof payloadType}` };
    }
    const messageBuilded = builder.build(name);
    return { name, payloadType, messageBuilded };
}
function loadProtoFile(file, builder) {
    if (!fs.existsSync(file)) {
        Logger.error(`${file} not exists`);
        return builder;
    }
    const newBuilder = protobuf.loadProtoFile(file, undefined, builder);
    return newBuilder;
}
class ProtobufMessages {
    names = {};
    payloadTypes = {};
    constructor(files) {
        const builder = files.reduce((prevBuilder, file) => loadProtoFile(file, prevBuilder), undefined);
        if (!builder) {
            Logger.error('Failed to load proto files', files);
            return;
        }
        builder.build();
        builder.ns.children.forEach((reflect) => {
            const { className } = reflect;
            if (className === 'Message') {
                const { name, payloadType, messageBuilded, reason, } = buildMessage(reflect, builder);
                if (!name || !payloadType || !messageBuilded) {
                    Logger.trace('Unhandled message', reflect.name, reason);
                    return;
                }
                this.names[name] = { name, payloadType, messageBuilded };
                this.payloadTypes[payloadType] = { payloadType, messageBuilded };
            }
            else if (className === 'Enum') {
                Logger.trace('Ignored className', className);
            }
            else {
                Logger.warn('Unhandled className', className, reflect.name);
            }
        });
        const messageBuilded = builder.build(protoMessageName);
        this.names[protoMessageName] = { name: protoMessageName, messageBuilded };
    }
    encode(name, payload, clientMsgId) {
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
    decode(buffer) {
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
export default ProtobufMessages;
