/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import tls from 'tls';
import { State } from '~constants/connection';
import type { Config } from '~types/Config.model';
import type { Command, ConnectionType, SendCommand } from '~types/Connection.model';
import type { CallbackPayload } from '~types/Event.model';
import type { PromiseCreator } from '~types/PromiseCreator.model';
import type { DecodedMessage } from '~types/ProtobufMessages.model';
import Formatter from './formatter';
import ProtobufMessages from './protobuf';
declare class Connection implements ConnectionType {
    host: string;
    port: number;
    clientId: string;
    clientSecret: string;
    name?: string;
    accountId?: string;
    accessToken?: string;
    refreshToken?: string;
    protocol: ProtobufMessages;
    formatter: Formatter;
    commands: Record<string, Command>;
    prevState: State;
    state: State;
    heartbeatInterval: NodeJS.Timer | undefined;
    destroyPromise: PromiseCreator<void> | undefined;
    socket: tls.TLSSocket | undefined;
    onEvent: (_: CallbackPayload) => void;
    onError: (_: any) => void;
    onClose: () => void;
    constructor(config: Config, onEvent: (_: CallbackPayload) => void, onError: (_: any) => void, onClose: () => void);
    setState(newState: State): void;
    encode(command: Command): Buffer;
    decode(data: any, callback: (msg: DecodedMessage) => void): void;
    sendGuaranteedCommand<T>(data: SendCommand): Promise<T>;
    start(): Promise<void>;
    destroy(): Promise<void>;
}
export default Connection;
