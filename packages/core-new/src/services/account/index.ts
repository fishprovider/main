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
  _repo;
  getService;
  getAccount = getAccount(() => this._repo);
  updateAccount = updateAccount(this, () => this._repo);
  joinAccount = joinAccount(this);

  constructor(repo: AccountRepository, container: IContainerService) {
    this._repo = repo;
    this.getService = <N extends ServiceName>(name: N) => container.getService(name);
  }
}
