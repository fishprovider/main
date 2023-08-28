import {
  type AccountRepository,
  type IAccountService,
  type IContainerService,
  ServiceName,
} from '../..';

export class AccountService implements IAccountService {
  name = ServiceName.account;
  repo;
  getService;
  getAccount = (() => () => { throw new Error('Not implemented'); })();

  constructor(repo: AccountRepository, container?: IContainerService) {
    this.repo = repo;
    this.getService = <N extends ServiceName>(name: N) => container?.getService(name);
  }
}
