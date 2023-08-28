import {
  type IContainerService,
  type IUserService,
  ServiceName,
  type UserRepository,
} from '../..';
import { getUser } from './getUser.service';
import { refreshUserRoles } from './refreshUserRoles.service';
import { updateUser } from './updateUser.service';

export class UserService implements IUserService {
  name = ServiceName.user;
  _repo;
  getService;
  getUser = getUser(this, () => this._repo);
  updateUser = updateUser(this, () => this._repo);
  refreshUserRoles = refreshUserRoles(this, () => this._repo);

  constructor(repo: UserRepository, container: IContainerService) {
    this._repo = repo;
    this.getService = <N extends ServiceName>(name: N) => container.getService(name);
  }
}
