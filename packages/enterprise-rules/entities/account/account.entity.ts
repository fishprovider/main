export enum AccountRoles {
  admin = 'admin',
  protector = 'protector',
  trader = 'trader',
  viewer = 'viewer',
}

export enum ProviderType {
  icmarkets = 'icmarkets',
  exness = 'exness',
}

export enum ProviderPlatform {
  ctrader = 'ctrader',
  metatrader = 'metatrader',
  fishct = 'fishct',
}

export enum ProviderTradeType {
  demo = 'demo',
  live = 'live',
}

export enum ProviderViewType {
  private = 'private',
  public = 'public',
}

export enum AccountSourceType {
  admin = 'admin',
  user = 'user',
}

export enum PlanType {
  pairs = 'pairs',

  maxLotTotal = 'maxLotTotal',
  maxLotOrder = 'maxLotOrder', // for each order, e.g. 0.1 lot
  maxLotPair = 'maxLotPair', // for all orders of a pair, e.g. 0.5 AUDUSD
  maxLotPairs = 'maxLotPairs',

  stopLoss = 'stopLoss',
  takeProfit = 'takeProfit',
  minTakeProfit = 'minTakeProfit',
  stepTakeProfit = 'stepTakeProfit',
  limitOnly = 'limitOnly',

  dayMaxBddLock = 'dayMaxBddLock',
  dayMaxEddLock = 'dayMaxEddLock',
  lostSeriesPairLock = 'lostSeriesPairLock',

  monthTargetLock = 'monthTargetLock',
  levelTargetsLock = 'levelTargetsLock', // { level: number, target: number, resetOnPass: bool } => activeLevelTarget
  parentLevelTargetLock = 'parentLevelTargetLock',

  profitOffset = 'profitOffset',
}

export enum CopyVolumeMode {
  auto = 'auto',
  fixedRatio = 'fixedRatio',
  fixedLot = 'fixedLot',
  autoWithRatio = 'autoWithRatio',
}

export enum LockType {
  open = 'open',
  update = 'update',
  close = 'close',
  pairs = 'pairs',
}

export interface Lock {
  type: LockType;
  value?: any;
  lockFrom: Date,
  lockUntil: Date,
  lockMessage: string;
  lockByUserId: string;
  lockByUserName: string;
}

export interface Investor {
  name: string;
  picture?: string;

  percent: number;

  createdAt: Date;
}

export interface Member {
  userId: string;
  email: string;
  role: AccountRoles;
  name: string;

  picture?: string;
  locks?: Lock[];

  updatedAt?: Date;
  createdAt?: Date;
}

export interface MemberInvite {
  email: string;
  role: AccountRoles;
  createdAt: Date;
}

export interface Plan {
  type: PlanType,
  value: any;
}

export type Config = {
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

export interface BannerStatus {
  enabled: boolean;
  notes?: string;
  bgColor?: string;
}

export interface CopySettings {
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

export interface TradeSettings {
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

export interface ProtectSettings {
  enabledEquityLock?: boolean,
  equityLock?: number,
  equityLockHours?: number,
}

export interface Settings {
  enableCopyParent?: boolean,
  parents?: Record<string, CopySettings>,
  copyVolumeRatio?: number, // auto
}

export interface Activity {
  lastView: Date;
}

export interface AccountStats extends Record<string, any> {
  profitMonths: Record<number, number[]>;
}

export interface AccountPublic {
  _id: string;
  name: string;

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

  sourceType?: AccountSourceType;
  createdAt?: Date;
  updatedAt?: Date;

  deleted?: boolean;
  deletedAt?: Date;
}

export interface Account extends AccountPublic {
  config: Config; // private
}
