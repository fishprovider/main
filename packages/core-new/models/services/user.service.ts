import type {
  BaseService, GetUserParams, User, UserRepository,
} from '..';

export type GetUserService = (
  params: GetUserParams
) => Promise<Partial<User> | null>;

export interface IUserService extends BaseService {
  repo: UserRepository
  getUser: GetUserService;
}
