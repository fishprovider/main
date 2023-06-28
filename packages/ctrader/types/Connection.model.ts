import type { CommonErrorCode, ErrorCode, PayloadType } from '~constants/openApi';
import type { PromiseCreator } from '~types/PromiseCreator.model';

interface SendCommand {
  name: string;
  payload: any
}

interface Command {
  clientMsgId: string;
  data: SendCommand;
  promise: PromiseCreator<any>;
}

interface CommandError {
  payloadType: PayloadType;
  errorCode?: ErrorCode | CommonErrorCode;
  description?: string;
  reason?: string;
  orderId?: string;
  positionId?: string;
  maintenanceEndTimestamp?: number;
}

interface CommandSuccess extends Record<string, any> {
  payloadType: PayloadType;
}

type CommandResponse = CommandError | CommandSuccess;

interface ConnectionType {
  clientId: string;
  clientSecret: string;
  name?: string;
  accountId?: string;
  accessToken?: string;
  refreshToken?: string;

  sendGuaranteedCommand: <T>(data: SendCommand) => Promise<T>;

  start: () => Promise<void>;
  destroy: () => Promise<void>;
}

export type {
  Command,
  CommandError,
  CommandResponse,
  CommandSuccess,
  ConnectionType,
  SendCommand,
};
