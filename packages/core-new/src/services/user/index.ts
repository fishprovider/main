import {
  type IContainerService,
  type IUserService,
  ServiceName,
} from '../..';
import { getUser } from './getUser.service';
import { refreshUserRoles } from './refreshUserRoles.service';
import { updateUser } from './updateUser.service';

export class UserService implements IUserService {
  name = ServiceName.user;
  getService;

  getUser = getUser(this);
  updateUser = updateUser(this);
  refreshUserRoles = refreshUserRoles(this);

  constructor(container: IContainerService) {
    this.getService = <N extends ServiceName>(name: N) => container.getService(name);
  }
}
