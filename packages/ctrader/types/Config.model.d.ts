interface Config {
    clientId: string;
    clientSecret: string;
    name?: string;
    accountId?: string;
    host: string;
    port: number;
    accessToken?: string;
    refreshToken?: string;
    refreshedAt?: Date;
    user?: string;
    pass?: string;
}
export type { Config, };
