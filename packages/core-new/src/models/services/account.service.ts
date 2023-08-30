import type {
  Account, AccountRepository, BaseServiceGetResult, BaseServiceParams,
  GetAccountFilter, UpdateAccountPayload, UserRepository,
} from '..';

export type GetAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetResult<Account>>;

export type UpdateAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  payload: UpdateAccountPayload,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetResult<Account>>;

export type JoinAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
}) => Promise<BaseServiceGetResult<Account>>;
