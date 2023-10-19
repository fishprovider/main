import { CTraderAccountRepository } from '@fishprovider/ctrader-api';
import { AccountRepository } from '@fishprovider/repositories';

export const TradeAccountRepository: AccountRepository = CTraderAccountRepository;
