export enum AccountType {
  icmarkets = 'icmarkets',
  exness = 'exness',
  myfxbook = 'myfxbook',
}

export enum AccountPlatform {
  ctrader = 'ctrader',
  metatrader = 'metatrader',
  fishct = 'fishct',
}

export enum AccountTradeType {
  demo = 'demo',
  live = 'live',
}

export enum AccountViewType {
  private = 'private',
  public = 'public',
}

export enum AccountRoles {
  admin = 'admin',
  protector = 'protector',
  trader = 'trader',
  viewer = 'viewer',
}

export enum AccountSourceType {
  admin = 'admin',
  user = 'user',
}

export enum AccountPlanType {
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

export enum AccountCopyVolumeMode {
  auto = 'auto',
  fixedRatio = 'fixedRatio',
  fixedLot = 'fixedLot',
  autoWithRatio = 'autoWithRatio',
}

export enum AccountLockType {
  open = 'open',
  update = 'update',
  close = 'close',
  pairs = 'pairs',
}

export interface AccountLock {
  type: AccountLockType;
  value?: any;
  lockFrom: Date,
  lockUntil: Date,
  lockMessage: string;
  lockByUserId: string;
  lockByUserName: string;
}

export interface AccountInvestor {
  name: string;
  picture?: string;

  percent: number;

  createdAt: Date;
}

export interface AccountMember {
  userId: string;
  email: string;
  role: AccountRoles;
  name: string;

  picture?: string;
  locks?: AccountLock[];

  updatedAt?: Date;
  createdAt?: Date;
}

export interface AccountMemberInvite {
  email: string;
  role: AccountRoles;
  createdAt: Date;
}

export interface AccountPlan {
  type: AccountPlanType,
  value: any;
}

export type AccountConfig = {
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

export interface AccountBannerStatus {
  enabled: boolean;
  notes?: string;
  bgColor?: string;
}

export interface AccountCopySettings {
  enableCopy?: boolean,
  enableCopyOrderClose?: boolean,
  enableCopyOrderSLTP?: boolean,

  copyVolumeMode?: AccountCopyVolumeMode,
  copyVolumeRatioFixed?: number, // fixedRatio
  copyVolumeLotFixed?: number, // fixedLot
  copyVolumeRatioAuto?: number, // autoWithRatio
  copyVolumeLotMin?: number,
  copyVolumeLotMax?: number,

  enabledEquitySL?: boolean,
  equitySLRatio?: number,
}

export interface AccountTradeSettings {
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

export interface AccountProtectSettings {
  enabledEquityLock?: boolean,
  equityLock?: number,
  equityLockHours?: number,
}

export interface AccountSettings {
  enableCopyParent?: boolean,
  parents?: Record<string, AccountCopySettings>,
  copyVolumeRatio?: number, // auto
}

export interface AccountActivity {
  lastView: Date;
}

export interface AccountStats extends Record<string, any> {
  profitMonths: Record<number, number[]>;
}

export interface Account {
  _id: string;
  name: string;

  providerType: AccountType;
  providerPlatform: AccountPlatform;
  providerPlatformType?: string;
  providerPlatformAccountId?: string;

  providerGroupId?: string;
  providerViewType?: AccountViewType;
  providerTradeType?: AccountTradeType;

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
    type: AccountType;
    url: string;
  }[];
  strategyCommission?: number;
  minInvest?: number;
  capital?: number;
  copiers?: number;
  rank?: string;
  order?: number;

  investors?: AccountInvestor[];
  members?: AccountMember[];
  memberInvites?: AccountMemberInvite[];

  tradeSettings?: AccountTradeSettings;
  protectSettings?: AccountProtectSettings;
  settings?: AccountSettings;

  plan?: AccountPlan[];
  planUpdatedAt?: Date;
  locks?: AccountLock[];
  activeLevelTarget?: number,

  notes?: string;
  privateNotes?: string;
  bannerStatus?: AccountBannerStatus;

  activities?: Record<string, AccountActivity>;
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

export interface AccountPrivate {
  config: AccountConfig;
}

export type AccountFull = Account & AccountPrivate;
