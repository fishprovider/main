export enum AccountType {
  icmarkets = 'icmarkets',
  exness = 'exness',
  roboforex = 'roboforex',
  alpari = 'alpari',
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

export enum AccountRole {
  admin = 'admin',
  protector = 'protector',
  trader = 'trader',
  viewer = 'viewer',
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
  email: string;
  role: AccountRole;
  name: string;

  picture?: string;
  locks?: AccountLock[];
  status?: 'add' | 'remove' | 'update' | 'done';

  updatedAt: Date;
  createdAt: Date;
}

export interface AccountMemberInvite {
  email: string;
  role: AccountRole;
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
  accountId: string;
  name: string;
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

export interface AccountEvent {
  userId?: string;
  lastView?: Date;
}

export interface AccountStats extends Record<string, any> {
  profitMonths: Record<number, number[]>;
}

export interface Account {
  _id: string;
  name: string;

  config?: AccountConfig;

  accountType: AccountType;
  accountPlatform: AccountPlatform;
  accountPlatformType?: string;

  accountGroupId?: string;
  accountViewType: AccountViewType;
  accountTradeType: AccountTradeType;

  asset?: string;
  assetId?: string;

  leverage?: number;
  balance?: number;

  balanceStartMonth?: number;
  balanceStartDay?: number;
  balanceStartDayUpdatedAt?: Date;

  margin?: number;

  maxEquity?: number;
  maxEquityTime?: Date;
  edd?: number;

  icon?: string;
  monthProfit?: number;
  roi?: number;
  riskScore?: number;
  winRate?: number;

  strategyId?: string;
  strategyLinks?: {
    type: AccountType;
    url: string;
  }[];
  minInvest?: number;
  capital?: number;
  rank?: string;
  order?: number;

  members: AccountMember[];
  investors?: AccountInvestor[];

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
  events?: AccountEvent[];

  providerData?: Record<string, any>; // trade data
  summary?: Record<string, any>; // cron data

  isSystem?: boolean;

  createdAt: Date;
  updatedAt: Date;

  deleted?: boolean;
  deletedAt?: Date;
}
