declare const authorizeAccount: (connection: ConnectionType, accessToken?: string, accountId?: string) => Promise<boolean>;
export default authorizeAccount;
