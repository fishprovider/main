import { AccountPlatform, ProviderType } from '~constants/account';
import type { Account, Lock, Plan } from '~types/Account.model';

const getAccountDefault: () => Account = () => ({
  _id: 'testAccountId',
  name: 'Test Account',
  providerType: ProviderType.icmarkets,
  accountPlatform: AccountPlatform.ctrader,
  config: {
    clientId: 'testClientId',
    clientSecret: 'testClientSecret',
  },
  plan: [],
  locks: [],
});

const getAccount = ({
  plan,
  locks,
}: {
  plan?: Plan[];
  locks?: Lock[];
} = {}) => {
  const account = getAccountDefault();

  if (plan && account.plan) {
    account.plan.push(...plan);
  }
  if (locks && account.locks) {
    account.locks.push(...locks);
  }

  return account;
};

export {
  getAccount,
  getAccountDefault,
};
