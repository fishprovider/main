import type {
  Account, AccountRepository, BaseGetOptions, BaseServiceGetResult,
  BaseServiceParams, BaseUpdateOptions, GetAccountFilter,
  UpdateAccountPayload, UserRepository,
} from '..';

export type GetAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetResult<Account>>;

export type UpdateAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  payload: UpdateAccountPayload,
  options: BaseUpdateOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetResult<Account>>;

export type JoinAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseUpdateOptions<Account>,
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
}) => Promise<BaseServiceGetResult<Account>>;
