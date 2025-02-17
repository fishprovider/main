//
// Important: Crypto only
//

import type {
  DestinationPayType,
  DestinationType,
  InvestStatus,
  SourceType,
  TransactionStatus,
  TransactionStatusRequest,
  TransactionType,
  WalletType,
} from '~constants/pay';

interface ManualData {
  userId: string;
  description: string;
  startedAt?: Date;
  endedAt?: Date;
}

interface Transaction {
  _id: string;
  type: TransactionType;
  status: TransactionStatus;
  statusRequest?: TransactionStatusRequest;
  userId: string;

  srcType: SourceType;
  srcId?: string;
  srcCurrency: string;
  srcAmount: number;
  srcFee?: number;
  srcBalanceRequest?: number;
  srcBalanceBefore?: number;
  srcBalanceAfter?: number;
  srcData?: {
    name?: string;
    description?: string;
  } & Record<string, any>; // external
  srcPayUrl?: string; // external

  dstType: DestinationType;
  dstId: string;
  dstCurrency: string;
  dstAmount?: number;
  dstFee?: number;
  dstBalanceRequest?: number;
  dstBalanceBefore?: number;
  dstBalanceAfter?: number;
  dstData?: {
    name?: string;
    description?: string;
  } & Record<string, any>; // external
  dstPayType?: DestinationPayType;
  dstPayAccountId?: string; // external
  dstPayId?: string; // external

  rate?: number;

  manualData?: ManualData,

  tag?: string;
  updatedLogs?: Record<string, any>[];

  createdAt: Date;
  updatedAt: Date;
}

interface InvestData {
  providerId: string;
  providerName: string;

  dstProviderId?: string,
  dstProviderName?: string,

  startedAt?: Date;
  balanceStart?: number;

  endedAt?: Date;
  balanceEnd?: number;

  profit?: number;
  roi?: number;
}

interface InvestPayment extends InvestData {
  providerBalanceStart?: number;
  providerBalanceEnd?: number;
  providerProfit?: number;
}

interface BaseWallet {
  _id: string;
  type: WalletType;

  userId: string;
  userEmail: string;
  userName: string;

  name: string;
  currency: string;
  balance: number;

  recentTransactions?: Transaction[];
  manualData?: ManualData,

  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

type SpotWallet = BaseWallet;

interface ExternalWallet extends BaseWallet {
  address?: string;
  walletData?: Record<string, any>;
}

interface InvestWallet extends BaseWallet {
  investStatus?: InvestStatus;
  investData?: InvestData;
  investPayments?: InvestPayment[];
  nextInvestPayment?: InvestPayment;
}

type Wallet = SpotWallet & ExternalWallet & InvestWallet;

export type {
  InvestData,
  InvestPayment,
  ManualData,
  Transaction,
  Wallet,
};
