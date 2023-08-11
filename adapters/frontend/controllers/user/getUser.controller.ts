import type { GetUserUseCase, GetUserUseCaseParams } from '@fishprovider/application';

export class GetUserController {
  getUserUseCase: GetUserUseCase;

  constructor(
    getUserUseCase: GetUserUseCase,
  ) {
    this.getUserUseCase = getUserUseCase;
  }

  async run(
    params: GetUserUseCaseParams,
  ) {
    return this.getUserUseCase.run(params);
  }
}
