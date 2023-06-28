import type { CopyVolumeMode, LockType, PlanType, ProviderPlatform, ProviderTradeType, ProviderType, ProviderViewType, SourceType } from '~constants/account';
import type { Roles } from '~constants/user';
interface Lock {
    type: LockType;
    value?: any;
    lockFrom: Date;
    lockUntil: Date;
    lockMessage: string;
    lockByUserId: string;
    lockByUserName: string;
}
interface Investor {
    name: string;
    picture?: string;
    percent: number;
    createdAt: Date;
}
interface Member {
    userId: string;
    email: string;
    role: Roles;
    name: string;
    picture?: string;
    locks?: Lock[];
    updatedAt?: Date;
    createdAt?: Date;
}
interface MemberInvite {
    email: string;
    role: Roles;
    createdAt: Date;
}
interface Plan {
    type: PlanType;
    value: any;
}
type Config = {
    clientId: string;
    clientSecret: string;
    accountId?: string;
    name?: string;
    user?: string;
    pass?: string;
    host?: string;
    port?: number;
    accessToken?: string;
    refreshToken?: string;
    refreshedAt?: Date;
    platform?: string;
    server?: string;
};
interface BannerStatus {
    enabled: boolean;
    notes?: string;
    bgColor?: string;
}
interface CopySettings {
    enableCopy?: boolean;
    enableCopyOrderClose?: boolean;
    enableCopyOrderSLTP?: boolean;
    copyVolumeMode?: CopyVolumeMode;
    copyVolumeRatioFixed?: number;
    copyVolumeLotFixed?: number;
    copyVolumeLotMin?: number;
    copyVolumeLotMax?: number;
    enabledEquitySL?: boolean;
    equitySLRatio?: number;
}
interface TradeSettings {
    enabledCloseProfit?: boolean;
    takeProfit?: number;
    stopLoss?: number;
    enabledCloseEquity?: boolean;
    targetEquity?: number;
    stopEquity?: number;
    enabledCloseTime?: boolean;
    closeTime?: Date;
    closeTimeIfProfit?: boolean;
}
interface ProtectSettings {
    enabledEquityLock?: boolean;
    equityLock?: number;
    equityLockHours?: number;
}
interface Settings {
    enableCopyParent?: boolean;
    parents?: Record<string, CopySettings>;
    copyVolumeRatio?: number;
}
interface Activity {
    lastView: Date;
}
interface AccountStats extends Record<string, any> {
    profitMonths: Record<number, number[]>;
}
interface Account {
    _id: string;
    name: string;
    config: Config;
    providerType: ProviderType;
    providerPlatform: ProviderPlatform;
    providerPlatformType?: string;
    providerPlatformAccountId?: string;
    providerGroupId?: string;
    providerViewType?: ProviderViewType;
    providerTradeType?: ProviderTradeType;
    asset?: string;
    assetId?: string;
    leverage?: number;
    balance?: number;
    balanceStart?: number;
    balanceStartDay?: number;
    balanceStartDayUpdatedAt?: Date;
    margin?: number;
    maxEquity?: number;
    maxEquityTime?: Date;
    edd?: number;
    icon?: string;
    maxYearProfit?: number;
    roi?: number;
    riskScore?: number;
    winRate?: number;
    strategyId?: string;
    strategyLinks?: {
        type: ProviderType;
        url: string;
    }[];
    strategyCommission?: number;
    minInvest?: number;
    capital?: number;
    copiers?: number;
    rank?: string;
    order?: number;
    investors?: Investor[];
    members?: Member[];
    memberInvites?: MemberInvite[];
    tradeSettings?: TradeSettings;
    protectSettings?: ProtectSettings;
    settings?: Settings;
    plan?: Plan[];
    planUpdatedAt?: Date;
    locks?: Lock[];
    activeLevelTarget?: number;
    notes?: string;
    privateNotes?: string;
    bannerStatus?: BannerStatus;
    activities?: Record<string, Activity>;
    stats?: AccountStats;
    providerData?: Record<string, any>;
    summary?: Record<string, any>;
    userId?: string;
    userEmail?: string;
    userName?: string;
    userPicture?: string;
    sourceType?: SourceType;
    createdAt?: Date;
    updatedAt?: Date;
    deleted?: boolean;
    deletedAt?: Date;
}
type AccountPublic = Omit<Account, 'config'>;
export type { Account, AccountPublic, AccountStats, Activity, BannerStatus, Config, CopySettings, Investor, Lock, Member, MemberInvite, Plan, ProtectSettings, Settings, TradeSettings, };
