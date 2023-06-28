import type { ChargePricingType, ChargeStatus } from '~constants/coinbaseCommerce';

interface Charge {
  name: string;
  description: string;
  pricing_type: ChargePricingType;
  metadata?: {
    customer_id: string;
    customer_name: string;
  };
  redirect_url?: string;
  cancel_url?: string;
}

interface ChargeReq extends Charge {
  local_price: {
    currency: string;
    amount: string;
  };
}

interface ChargePayment {
  payment_id: string;
  network: string;
  transaction_id: string;
  status: string;
  detected_at: string;
  net: {
    local: {
      currency: string;
      amount: number;
    },
    crypto: {
      currency: string;
      amount: number;
    }
  }
}

interface ChargeRes extends Charge {
  id: string;
  code: string;
  hosted_url: string,
  pricing: {
    local: {
      currency: string;
      amount: string;
    }
  },
  fee_rate: number;
  timeline: {
    status: ChargeStatus;
    time: string;
  }[],
  payments: ChargePayment[],
  created_at: string;
}

interface ChargesResPagination {
  order: 'desc' | 'asc';
  starting_after?: string;
  ending_before?: string;
  limit: number;
  total: number;
  yielded: number;
  cursor_range: string[];
  previous_uri: string;
  next_uri: string;
}

export type {
  ChargeReq,
  ChargeRes,
  ChargesResPagination,
};
