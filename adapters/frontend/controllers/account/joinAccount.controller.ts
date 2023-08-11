import type { JoinAccountUseCase, JoinAccountUseCaseParams } from '@fishprovider/application';

export class JoinAccountController {
  joinAccountUseCase: JoinAccountUseCase;

  constructor(
    joinAccountUseCase: JoinAccountUseCase,
  ) {
    this.joinAccountUseCase = joinAccountUseCase;
  }

  async run(
    params: JoinAccountUseCaseParams,
  ) {
    return this.joinAccountUseCase.run(params);
  }
}
