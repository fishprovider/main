import path from 'path';
import tls from 'tls';
import url from 'url';
import authorizeApplication from '~commands/authorizeApplication';
import sendHeartbeat from '~commands/sendHeartbeat';
import { State } from '~constants/connection';
import promiseCreator from '~utils/promiseCreator';
import random from '~utils/random';
import handleEvents from './events';
import Formatter from './formatter';
import ProtobufMessages from './protobuf';
const env = {
    ctraderProtoTmp: process.env.CTRADER_PROTO_TMP,
};
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const protoFile1 = env.ctraderProtoTmp
    ? path.join('/tmp', 'protos', 'OpenApiCommonMessages.proto')
    : path.join(__dirname, '..', 'protos', 'OpenApiCommonMessages.proto');
const protoFile2 = env.ctraderProtoTmp
    ? path.join('/tmp', 'protos', 'OpenApiMessages.proto')
    : path.join(__dirname, '..', 'protos', 'OpenApiMessages.proto');
class Connection {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    host;
    port;
    clientId;
    clientSecret;
    name;
    accountId;
    accessToken;
    refreshToken;
    protocol;
    formatter;
    commands;
    prevState = State.NEW;
    state = State.NEW;
    heartbeatInterval;
    destroyPromise;
    socket;
    onEvent;
    onError;
    onClose;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
    constructor(config, onEvent, onError, onClose) {
        const { host, port, clientId, clientSecret, name, accountId, accessToken, refreshToken, } = config;
        this.host = host;
        this.port = port;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.name = name || accountId || clientId;
        this.accountId = accountId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.protocol = new ProtobufMessages([protoFile1, protoFile2]);
        this.formatter = new Formatter();
        this.commands = {};
        this.onEvent = onEvent;
        this.onError = onError;
        this.onClose = onClose;
    }
    //
    // helpers
    //
    setState(newState) {
        Logger.debug(`[${this.name}] State changing from ${this.state} to ${newState}`);
        this.prevState = this.state;
        this.state = newState;
    }
    encode(command) {
        const { clientMsgId, data } = command;
        const { name, payload } = data;
        return this.formatter.encode(this.protocol.encode(name, payload, clientMsgId));
    }
    decode(data, callback) {
        this.formatter.decode(data, (formattedData) => {
            callback(this.protocol.decode(formattedData));
        });
    }
    //
    // public methods
    //
    async sendGuaranteedCommand(data) {
        if (![State.CONNECTED, State.STARTED].includes(this.state)) {
            const msg = `[${data.name}] Invalid state ${this.name}: ${this.state}`;
            Logger.warn(msg);
            this.onError(msg);
            throw new Error(msg);
        }
        const clientMsgId = random();
        const promise = promiseCreator();
        this.commands[clientMsgId] = {
            clientMsgId,
            data,
            promise,
        };
        if (this.socket) {
            const { name, payload } = data;
            this.socket.write(this.formatter.encode(this.protocol.encode(name, payload, clientMsgId)));
        }
        // promise will be resolved in socket.on('data')
        const res = await promise;
        return res;
    }
    async start() {
        Logger.debug(`[${this.name}] Starting`);
        await new Promise((resolve, reject) => {
            this.socket = tls.connect({
                host: this.host,
                port: this.port,
            }, () => {
                this.setState(State.CONNECTED);
                resolve(true);
            });
            this.socket.on('error', (error) => {
                console.error(`[${this.name}] Connection error`, error);
                this.setState(State.ERROR);
                if (this.prevState === State.CONNECTED) {
                    this.onError(error);
                }
                else {
                    reject(error);
                }
            });
            this.socket.on('close', () => {
                // console.warn(`[${this.name}] Connection closed`);
                this.setState(State.CLOSED);
                if (this.destroyPromise) {
                    this.destroyPromise.resolveExec();
                }
                if (this.prevState === State.STARTED) {
                    this.onClose();
                }
                else {
                    this.onError(`[${this.name}] Connection closed`);
                }
            });
            this.socket.on('data', (data) => {
                this.decode(data, (decodedData) => {
                    const { clientMsgId, payload } = decodedData;
                    if (clientMsgId && this.commands[clientMsgId]) {
                        this.commands[clientMsgId]?.promise.resolveExec(payload);
                        delete this.commands[clientMsgId];
                    }
                    else {
                        handleEvents(decodedData, (msg) => {
                            this.onEvent(msg);
                        });
                    }
                });
            });
        });
        await authorizeApplication(this);
        Logger.debug(`[${this.name}] Authorized application`);
        this.heartbeatInterval = setInterval(() => {
            if ([State.CONNECTED, State.STARTED].includes(this.state)) {
                sendHeartbeat(this);
            }
        }, 10000);
        Logger.debug(`[${this.name}] Started`);
        this.setState(State.STARTED);
    }
    async destroy() {
        Logger.debug(`[${this.name}] Destroying`);
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }
        if (this.socket) {
            this.destroyPromise = promiseCreator();
            this.socket.destroy();
            await this.destroyPromise;
            this.destroyPromise = undefined;
        }
        Logger.debug(`[${this.name}] Destroyed`);
    }
}
export default Connection;
