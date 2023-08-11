import type { UpdateUserUseCase, UpdateUserUseCaseParams } from '@fishprovider/application';

export class UpdateUserController {
  updateUserUseCase: UpdateUserUseCase;

  constructor(
    updateUserUseCase: UpdateUserUseCase,
  ) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async run(
    params: UpdateUserUseCaseParams,
  ) {
    return this.updateUserUseCase.run(params);
  }
}
