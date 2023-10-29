import { PromiseCreator } from '@fishprovider/core';
import { Message, MetaMessage } from 'protobufjs';

import { CTraderCommonErrorCode, CTraderErrorCode, CTraderPayloadType } from '.';

export interface CTraderConfig {
  clientId: string;
  clientSecret: string;
  name?: string;
  accountId?: string;

  host: string;
  port: number;
  accessToken?: string;
  refreshToken?: string;
  refreshedAt?: Date,
  user?: string;
  pass?: string;
}

export interface CTraderMessageName {
  name: string;
  payloadType?: CTraderPayloadType;
  messageBuilded: MetaMessage<Message>;
}

export interface CTraderMessagePayloadType {
  payloadType: CTraderPayloadType;
  messageBuilded: MetaMessage<Message>;
}

export interface CTraderDecodedMessage {
  payload: any;
  payloadType: CTraderPayloadType;
  clientMsgId?: string;
}

export interface CTraderProtobufMessages {
  names: Record<string, CTraderMessageName>;
  payloadTypes: Record<string, CTraderMessagePayloadType>;

  encode: (name: string, payload: any, clientMsgId?: string) => ByteBuffer;
  decode: (buffer: Buffer) => CTraderDecodedMessage;
}

export interface CTraderFormatter {
  sizeLength: number;
  size?: number;
  tail?: Buffer;

  encode(data: ByteBuffer): Buffer;
  decode(buff: Buffer, decodeHandler: (data: Buffer) => void): void;
}

export enum CTraderConnectionState {
  NEW = 0,
  CONNECTED = 1,
  STARTED = 2,
  ERROR = 3,
  CLOSED = 4,
}

export interface CTraderSendCommand {
  name: string;
  payload: any
}

export interface CTraderCommand {
  clientMsgId: string;
  data: CTraderSendCommand;
  promise: PromiseCreator<any>;
}

export interface CTraderCommandError {
  payloadType: CTraderPayloadType;
  errorCode?: CTraderErrorCode | CTraderCommonErrorCode;
  description?: string;
  reason?: string;
  orderId?: string;
  positionId?: string;
  maintenanceEndTimestamp?: number;
}

export interface CTraderCommandSuccess extends Record<string, any> {
  payloadType: CTraderPayloadType;
}

export type CTraderCommandResponse = CTraderCommandError | CTraderCommandSuccess;

export interface TCTraderConnection {
  clientId: string;
  clientSecret: string;
  name?: string;
  accountId?: string;
  accessToken?: string;
  refreshToken?: string;

  sendGuaranteedCommand: <T>(data: CTraderSendCommand) => Promise<T>;

  start: () => Promise<void>;
  destroy: () => Promise<void>;
}
