import {
  type IContainerService,
  type IUserService,
  ServiceName,
  type UserRepository,
} from '../..';
import { getUser } from './getUser.service';

export class UserService implements IUserService {
  name = ServiceName.user;
  repo;
  getService;
  getUser = getUser(this);

  constructor(repo: UserRepository, container?: IContainerService) {
    this.repo = repo;
    this.getService = <N extends ServiceName>(name: N) => container?.getService(name);
  }
}
