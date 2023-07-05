import type {
  CopyVolumeMode, LockType, PlanType, ProviderPlatform, ProviderTradeType,
  ProviderType, ProviderViewType, SourceType,
} from '~constants/account';
import type { Roles } from '~constants/user';

interface Lock {
  type: LockType;
  value?: any;
  lockFrom: Date,
  lockUntil: Date,
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
  type: PlanType,
  value: any;
}

type Config = {
  // common
  clientId: string;
  clientSecret: string;
  accountId?: string;
  name?: string;
  user?: string;
  pass?: string;

  // ctrader
  host?: string;
  port?: number;
  accessToken?: string;
  refreshToken?: string;
  refreshedAt?: Date,

  // metatrader
  platform?: string; // mt4, mt5
  server?: string;
};

interface BannerStatus {
  enabled: boolean;
  notes?: string;
  bgColor?: string;
}

interface CopySettings {
  enableCopy?: boolean,
  enableCopyOrderClose?: boolean,
  enableCopyOrderSLTP?: boolean,

  copyVolumeMode?: CopyVolumeMode,
  copyVolumeRatioFixed?: number, // fixedRatio
  copyVolumeLotFixed?: number, // fixedLot
  copyVolumeRatioAuto?: number, // autoWithRatio
  copyVolumeLotMin?: number,
  copyVolumeLotMax?: number,

  enabledEquitySL?: boolean,
  equitySLRatio?: number,
}

interface TradeSettings {
  enabledCloseProfit?: boolean,
  takeProfit?: number,
  stopLoss?: number,

  enabledCloseEquity?: boolean,
  targetEquity?: number,
  stopEquity?: number,

  enabledCloseTime?: boolean,
  closeTime?: Date,
  closeTimeIfProfit?: boolean,
}

interface ProtectSettings {
  enabledEquityLock?: boolean,
  equityLock?: number,
  equityLockHours?: number,
}

interface Settings {
  enableCopyParent?: boolean,
  parents?: Record<string, CopySettings>,
  copyVolumeRatio?: number, // auto
}

interface Activity {
  lastView: Date;
}

interface AccountStats extends Record<string, any> {
  profitMonths: Record<number, number[]>;
}

interface Account {
  _id: string; // whale, shark, tuna-spot, tuna-margin, tuna-margin-isolated, tuna-future
  name: string; // Whale, Shark, Tuna Spot, Tuna Margin, Tuna Margin Isolated, Tuna Future
  config: Config; // private

  providerType: ProviderType; // icmarkets, exness, roboforex
  providerPlatform: ProviderPlatform; // ctrader, metatrader
  providerPlatformType?: string; // standard, pro
  providerPlatformAccountId?: string;

  providerGroupId?: string; // earth, earth2, earth3
  providerViewType?: ProviderViewType; // private, public
  providerTradeType?: ProviderTradeType; // demo, live

  asset?: string;
  assetId?: string;

  leverage?: number;

  balance?: number;
  balanceStart?: number;
  balanceStartDay?: number;
  balanceStartDayUpdatedAt?: Date;

  margin?: number; // MetaTrader only

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
  activeLevelTarget?: number,

  notes?: string;
  privateNotes?: string;
  bannerStatus?: BannerStatus;

  activities?: Record<string, Activity>;
  stats?: AccountStats;

  providerData?: Record<string, any>; // external
  summary?: Record<string, any>; // cron data

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

export type {
  Account,
  AccountPublic,
  AccountStats,
  Activity,
  BannerStatus,
  Config,
  CopySettings,
  // Target,
  Investor,
  Lock,
  Member,
  MemberInvite,
  Plan,
  ProtectSettings,
  Settings,
  TradeSettings,
};
