import type { InvoiceStatus, InvoiceType } from '~constants/requestFinance';

interface Invoice {
  buyerInfo: {
    email: string,
    lastName?: string,
    firstName?: string,
    businessName?: string,
    taxRegistration?: string,
  },
  invoiceItems: {
    currency: string,
    name: string,
    quantity: number,
    unitPrice: number,
  }[],
  invoiceNumber: string,
  paymentCurrency: string, // 'USDT-mainnet'
  declarativePaymentInformation: {
    paymentAddress: string,
  },
  creationDate: Date,
  paymentTerms: {
    dueDate: Date,
  },
  miscellaneous?: {
    createdWith: string;
    logoUrl: string,
  },
  tags?: string[],
}

type InvoiceReq = Invoice;

interface InvoiceWithLinks extends Invoice {
  id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  invoiceLinks: {
    pay: string,
    signUpAndPay: string,
  }
}

interface TrackedTransaction {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  txHash: string;
  requestId: string;
  status: string;
}

interface InvoiceGet extends Invoice {
  id: string;
  requestId: string;
  type: string;
  status: InvoiceStatus;
  trackedTransactions: TrackedTransaction[];
  paymentMetadata: {
    txHash: string,
    paymentFrom: string,
    paymentDate: Date,
    paymentCurrency: string,

    paidAmount: number;
    paidAmountCrypto: number;
    paidAmountUsd: number;

    gasFee: number,
    gasFeeUsd: number,
    gasFeeEth: number,

    requestFeeCurrency: string,
    requestFee: number,
    requestFeeUsd: number,
  }
}

export type {
  Invoice,
  InvoiceGet,
  InvoiceReq,
  InvoiceWithLinks,
};
