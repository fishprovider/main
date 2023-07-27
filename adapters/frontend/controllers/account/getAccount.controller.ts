import type { GetAccountUseCase, GetAccountUseCaseParams } from '@fishprovider/application-rules';

export class GetAccountController {
  getAccountUseCase: GetAccountUseCase;

  constructor(
    getAccountUseCase: GetAccountUseCase,
  ) {
    this.getAccountUseCase = getAccountUseCase;
  }

  async run(
    params: GetAccountUseCaseParams,
  ) {
    return this.getAccountUseCase.run(params);
  }
}
