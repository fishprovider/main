import {
  type AccountRepository,
  type IAccountService,
  type IContainerService,
  ServiceName,
} from '../..';
import { getAccount } from './getAccount.service';

export class AccountService implements IAccountService {
  name = ServiceName.account;
  repo;
  getService;
  getAccount = getAccount(this);

  constructor(repo: AccountRepository, container?: IContainerService) {
    this.repo = repo;
    this.getService = <N extends ServiceName>(name: N) => container?.getService(name);
  }
}
