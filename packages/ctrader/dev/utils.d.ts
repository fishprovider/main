import type { ConnectionType } from '~types/Connection.model';
import type { CallbackPayload } from '~types/Event.model';
declare const renewTokens: (connection: ConnectionType, refreshToken: string) => Promise<any>;
declare const getConfig: () => Promise<import("@fishbot/utils/types/Account.model").Config>;
declare const createConnection: (onEvent?: ((_: CallbackPayload) => void) | undefined, configOverride?: any) => Promise<ConnectionType>;
declare const destroyConnection: (connection: ConnectionType) => Promise<void>;
export { createConnection, destroyConnection, getConfig, renewTokens, };
