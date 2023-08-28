import {
  type AccountRepository,
  type IAccountService,
  type IContainerService,
  ServiceName,
} from '../..';
import { getAccount } from './getAccount.service';
import { joinAccount } from './joinAccount.service';
import { updateAccount } from './updateAccount.service';

export class AccountService implements IAccountService {
  name = ServiceName.account;
  repo;
  getService;
  getAccount = getAccount(this);
  updateAccount = updateAccount(this);
  joinAccount = joinAccount(this);

  constructor(repo: AccountRepository, container: IContainerService) {
    this.repo = repo;
    this.getService = <N extends ServiceName>(name: N) => container.getService(name);
  }
}
