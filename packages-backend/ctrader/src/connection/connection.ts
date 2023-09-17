import { PromiseCreator, promiseCreator, random } from '@fishprovider/core-utils';
import appRootPath from 'app-root-path';
import path from 'path';
import tls from 'tls';

import {
  authorizeApplication,
  CTraderCallbackPayload, CTraderCommand, CTraderConfig, CTraderConnectionState,
  CTraderDecodedMessage, CTraderSendCommand, Formatter, handleEvent,
  ProtobufMessages, sendHeartbeat, TCTraderConnection,
} from '..';

const env = {
  ctraderProtoTmp: process.env.CTRADER_PROTO_TMP,
};

const rootPath = appRootPath.toString();
console.log('rootPath', rootPath);

const protoFile1 = env.ctraderProtoTmp
  ? path.join('/tmp', 'proto', 'OpenApiCommonMessages.proto')
  : path.join(rootPath, 'packages-backend', 'ctrader', 'proto', 'OpenApiCommonMessages.proto');
const protoFile2 = env.ctraderProtoTmp
  ? path.join('/tmp', 'proto', 'OpenApiMessages.proto')
  : path.join(rootPath, 'packages-backend', 'ctrader', 'proto', 'OpenApiMessages.proto');
console.log('protoFiles', protoFile1, protoFile2);

export class Connection implements TCTraderConnection {
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
  commands: Record<string, CTraderCommand>;

  prevState: CTraderConnectionState = CTraderConnectionState.NEW;
  state: CTraderConnectionState = CTraderConnectionState.NEW;

  heartbeatInterval: NodeJS.Timeout | undefined;
  destroyPromise: PromiseCreator<void> | undefined;
  socket: tls.TLSSocket | undefined;

  onEvent: (_: CTraderCallbackPayload) => void;
  onError: (_: any) => void;
  onClose: () => void;

  constructor(
    config: CTraderConfig,
    onEvent: (_: CTraderCallbackPayload) => void,
    onError: (_: any) => void,
    onClose: () => void,
  ) {
    const {
      host, port, clientId, clientSecret, name,
      accountId, accessToken, refreshToken,
    } = config;
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

  setState(newState: CTraderConnectionState) {
    // Logger.debug(`[${this.name}] State changing from ${this.state} to ${newState}`);
    this.prevState = this.state;
    this.state = newState;
  }

  encode(command: CTraderCommand): Buffer {
    const { clientMsgId, data } = command;
    const { name, payload } = data;
    return this.formatter.encode(
      this.protocol.encode(name, payload, clientMsgId),
    );
  }

  decode(data: any, callback: (msg: CTraderDecodedMessage) => void) {
    this.formatter.decode(data, (formattedData) => {
      callback(this.protocol.decode(formattedData));
    });
  }

  //
  // public methods
  //

  async sendGuaranteedCommand<T>(data: CTraderSendCommand): Promise<T> {
    if (![CTraderConnectionState.CONNECTED, CTraderConnectionState.STARTED].includes(this.state)) {
      const msg = `[${data.name}] Invalid state ${this.name}: ${this.state}`;
      console.warn(msg);
      this.onError(msg);
      throw new Error(msg);
    }

    const clientMsgId = random();
    const promise = promiseCreator<T>();

    this.commands[clientMsgId] = {
      clientMsgId,
      data,
      promise,
    };

    if (this.socket) {
      const { name, payload } = data;
      this.socket.write(
        this.formatter.encode(
          this.protocol.encode(name, payload, clientMsgId),
        ),
      );
    }

    // promise will be resolved in socket.on('data')
    const res = await promise;
    return res as T;
  }

  async start() {
    // Logger.debug(`[${this.name}] Starting`);

    await new Promise((resolve, reject) => {
      this.socket = tls.connect({
        host: this.host,
        port: this.port,
      }, () => {
        this.setState(CTraderConnectionState.CONNECTED);
        resolve(true);
      });

      this.socket.on('error', (error) => {
        console.error(`[${this.name}] Connection error`, error);
        this.setState(CTraderConnectionState.ERROR);

        if (this.prevState === CTraderConnectionState.CONNECTED) {
          this.onError(error);
        } else {
          reject(error);
        }
      });

      this.socket.on('close', () => {
        // console.warn(`[${this.name}] Connection closed`);
        this.setState(CTraderConnectionState.CLOSED);

        if (this.destroyPromise) {
          this.destroyPromise.resolveExec();
        }

        if (this.prevState === CTraderConnectionState.STARTED) {
          this.onClose();
        } else {
          this.onError(`[${this.name}] Connection closed`);
        }
      });

      this.socket.on('data', (data) => {
        this.decode(data, (decodedData) => {
          const { clientMsgId, payload } = decodedData;
          if (clientMsgId && this.commands[clientMsgId]) {
            this.commands[clientMsgId]?.promise.resolveExec(payload);
            delete this.commands[clientMsgId];
          } else {
            handleEvent(decodedData, (msg) => {
              this.onEvent(msg);
            });
          }
        });
      });
    });

    await authorizeApplication(this);
    // Logger.debug(`[${this.name}] Authorized application`);

    this.heartbeatInterval = setInterval(() => {
      if ([CTraderConnectionState.CONNECTED, CTraderConnectionState.STARTED].includes(this.state)) {
        sendHeartbeat(this);
      }
    }, 10000);

    // Logger.debug(`[${this.name}] Started`);
    this.setState(CTraderConnectionState.STARTED);
  }

  async destroy() {
    // Logger.debug(`[${this.name}] Destroying`);

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

    // Logger.debug(`[${this.name}] Destroyed`);
  }
}
